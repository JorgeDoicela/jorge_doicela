#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

/**
 * CLI de Optimización y Conversión a WebP para el Monorepo
 * ─────────────────────────────────────────────────────────────────────────────
 * Motor: Sharp (libvips)
 * Uso:
 *   node scripts/convert-webp.mjs [opciones]
 *
 * Opciones:
 *   --target <dir>          Directorio relativo o absoluto a procesar
 *   --project <nombre>      Alias de proyecto (doiceladev, portfolio, kartex, landing, all)
 *   --quality <1-100>       Calidad para imágenes lossy (por defecto: 82)
 *   --max-width <px>        Ancho máximo para reescalado inteligente (por defecto: 1920)
 *   --dry-run               Simular proceso y calcular ahorro sin modificar disco
 *   --delete-original       Eliminar archivo original (png/jpg) tras generar y validar webp
 *   --update-references     Actualizar referencias en corpus/*.json y código del frontend
 *   --seed                  Ejecutar seeder atómico del backend tras la conversión
 * ─────────────────────────────────────────────────────────────────────────────
 */

const PROJECT_MAP = {
  doiceladev: 'frontend/web/public/doiceladev',
  portfolio: 'frontend/web/public/portfolio',
  kartex: 'frontend/web/public/kartex',
  landing: 'frontend/web/public/landing',
  all: 'frontend/web/public',
};

const args = process.argv.slice(2);

function getArgValue(flag, defaultValue) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return defaultValue;
}

const isDryRun = args.includes('--dry-run');
const shouldDeleteOriginal = args.includes('--delete-original');
const shouldUpdateReferences = args.includes('--update-references');
const shouldSeed = args.includes('--seed');
const quality = parseInt(getArgValue('--quality', '82'), 10);
const maxWidth = parseInt(getArgValue('--max-width', '1920'), 10);
const projectAlias = getArgValue('--project', 'doiceladev');
const customTarget = getArgValue('--target', null);

const targetDirectory = customTarget || PROJECT_MAP[projectAlias] || PROJECT_MAP.doiceladev;

if (!fs.existsSync(targetDirectory)) {
  console.error(`Error: El directorio objetivo "${targetDirectory}" no existe.`);
  process.exit(1);
}

function findImages(dir) {
  let list = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      list = list.concat(findImages(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        list.push(fullPath);
      }
    }
  }
  return list;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

async function convertFile(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const outPath = path.join(dir, `${baseName}.webp`);

  const initialStat = fs.statSync(filePath);
  const originalSize = initialStat.size;

  if (isDryRun) {
    // Estimación teórica conservadora para dry-run
    const estimatedReduction = ext === '.png' ? 0.7 : 0.8;
    const estimatedSize = Math.round(originalSize * (1 - estimatedReduction));
    return {
      filePath,
      outPath,
      originalSize,
      newSize: estimatedSize,
      savedBytes: originalSize - estimatedSize,
      success: true,
      isDryRun: true,
    };
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let transform = image;
    if (metadata.width && metadata.width > maxWidth) {
      transform = transform.resize({
        width: maxWidth,
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    const isTransparentPng = ext === '.png' && (metadata.hasAlpha || metadata.channels === 4);

    if (isTransparentPng) {
      // Logos y gráficos con canal alfa: compresión WebP sin pérdida o alta calidad alfa
      await transform
        .webp({
          quality: 90,
          effort: 6,
          alphaQuality: 100,
          lossless: false,
        })
        .toFile(outPath);
    } else {
      // Portadas y fotos: compresión WebP estándar optimizada
      await transform
        .webp({
          quality,
          effort: 5,
        })
        .toFile(outPath);
    }

    const finalStat = fs.statSync(outPath);
    const newSize = finalStat.size;

    // Validación de integridad
    const verifyMeta = await sharp(outPath).metadata();
    if (!verifyMeta.width || !verifyMeta.height) {
      throw new Error('Validación de integridad fallida en imagen WebP generada');
    }

    if (shouldDeleteOriginal && fs.existsSync(outPath) && newSize > 0) {
      fs.unlinkSync(filePath);
    }

    return {
      filePath,
      outPath,
      originalSize,
      newSize,
      savedBytes: originalSize - newSize,
      success: true,
      isDryRun: false,
    };
  } catch (error) {
    return {
      filePath,
      outPath,
      originalSize,
      newSize: originalSize,
      savedBytes: 0,
      success: false,
      error: error.message,
    };
  }
}

function updateReferencesInFiles(replacements, project) {
  const PROJECT_DIR_MAP = {
    doiceladev: [
      'backend/src/doiceladev/corpus',
      'frontend/web/src/app/(doiceladev)',
      'docs/05-doiceladev',
    ],
    landing: [
      'frontend/web/src/app/(landing)',
      'docs/02-landing',
    ],
    portfolio: [
      'frontend/web/src/app/(portfolio)',
      'docs/03-portfolio',
    ],
    kartex: [
      'frontend/web/src/app/(kartex)',
      'docs/04-kartex',
    ],
    all: [
      'backend/src',
      'frontend/web/src/app',
      'docs',
    ],
  };

  const targetDirs = PROJECT_DIR_MAP[project] || PROJECT_DIR_MAP.doiceladev;
  let totalUpdated = 0;

  function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
        processDir(fullPath);
      } else if (entry.isFile()) {
        // Excluir manifest.json para preservar compatibilidad PWA estricta W3C en PNG
        if (entry.name === 'manifest.json') continue;

        const ext = path.extname(entry.name).toLowerCase();
        if (['.json', '.ts', '.tsx', '.md'].includes(ext)) {
          let content = fs.readFileSync(fullPath, 'utf8');
          let modified = false;

          for (const [from, to] of replacements.entries()) {
            if (content.includes(from)) {
              content = content.replaceAll(from, to);
              modified = true;
            }
          }

          if (modified) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`  [Sincronizado] ${fullPath}`);
            totalUpdated++;
          }
        }
      }
    }
  }

  for (const d of targetDirs) {
    processDir(d);
  }

  return totalUpdated;
}

async function main() {
  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log('Optimizador de Imágenes WebP — Monorepo Jorge Doicela');
  console.log(`Directorio objetivo: ${targetDirectory}`);
  console.log(`Modo: ${isDryRun ? 'SIMULACIÓN (Dry-Run)' : 'CONVERSIÓN ACTIVA'}`);
  console.log(`Calidad: ${quality}% | Ancho Máximo: ${maxWidth}px`);
  console.log(`Eliminar originales: ${shouldDeleteOriginal ? 'SÍ' : 'NO'}`);
  console.log('─────────────────────────────────────────────────────────────────────────────\n');

  const files = findImages(targetDirectory);
  if (files.length === 0) {
    console.log('No se encontraron imágenes .jpg, .jpeg o .png para procesar.');
    return;
  }

  console.log(`Encontradas ${files.length} imágenes para procesar.\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;
  const replacements = new Map();

  for (const file of files) {
    const res = await convertFile(file);
    totalOriginal += res.originalSize;
    totalOptimized += res.newSize;

    const baseOriginal = path.basename(res.filePath);
    const baseNew = path.basename(res.outPath);
    replacements.set(baseOriginal, baseNew);

    const ratio = ((1 - res.newSize / res.originalSize) * 100).toFixed(1);
    const status = res.success ? 'OK' : 'ERROR';

    console.log(
      `[${status}] ${path.relative('.', res.filePath)} -> ${baseNew} ` +
      `(${formatBytes(res.originalSize)} -> ${formatBytes(res.newSize)} | -${ratio}%)`
    );
  }

  const savedTotal = totalOriginal - totalOptimized;
  const totalRatio = ((savedTotal / totalOriginal) * 100).toFixed(1);

  console.log('\n─────────────────────────────────────────────────────────────────────────────');
  console.log('Resumen de Optimización:');
  console.log(`  Peso Original:    ${formatBytes(totalOriginal)}`);
  console.log(`  Peso Optimizado:  ${formatBytes(totalOptimized)}`);
  console.log(`  Ahorro Total:     ${formatBytes(savedTotal)} (-${totalRatio}%)`);
  console.log('─────────────────────────────────────────────────────────────────────────────\n');

  if (shouldUpdateReferences && !isDryRun) {
    console.log(`Sincronizando referencias para el proyecto "${projectAlias}"...`);
    const filesModified = updateReferencesInFiles(replacements, projectAlias);
    console.log(`Referencias sincronizadas en ${filesModified} archivos.\n`);

    if (shouldSeed) {
      console.log('Ejecutando seeder atómico de DoicelaDev (pnpm seed:doiceladev)...');
      const { execSync } = await import('node:child_process');
      execSync('pnpm --filter backend seed:doiceladev', { stdio: 'inherit' });
      console.log('Base de datos SQLite actualizada correctamente.\n');
    }
  }
}

main().catch((err) => {
  console.error('Error durante la ejecución:', err);
  process.exit(1);
});

