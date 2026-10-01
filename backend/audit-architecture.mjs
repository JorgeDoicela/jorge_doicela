import fs from 'fs';
import path from 'path';

function getFiles(dir, matchExt = ['.ts', '.tsx']) {
  let res = [];
  if (!fs.existsSync(dir)) return res;
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.next' || item === 'dist') continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      res = res.concat(getFiles(full, matchExt));
    } else if (matchExt.some((ext) => full.endsWith(ext))) {
      res.push(full);
    }
  }
  return res;
}

console.log('================================================================');
console.log(' AUDITORIA ARQUITECTONICA SENIOR: DOICELADEV & KARTEX');
console.log('================================================================\n');

// ─────────────────────────────────────────────────────────────
// 1. AISLAMIENTO DE DOMINIO Y CAJAS NEGRAS (CERO CROSS-IMPORTS)
// ─────────────────────────────────────────────────────────────
console.log('--- 1. AUDITORIA DE CAJAS NEGRAS (CERO IMPORTACIONES CRUZADAS) ---');

function auditCrossImports(dir, domainName, forbiddenDomains) {
  const files = getFiles(dir);
  const issues = [];
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('import ') || (trimmed.startsWith('export ') && trimmed.includes(' from '))) {
        for (const forbidden of forbiddenDomains) {
          if (
            line.includes(`(${forbidden})`) ||
            line.includes(`/${forbidden}/`) ||
            line.includes(`"../${forbidden}`) ||
            line.includes(`'../${forbidden}`)
          ) {
            issues.push({
              file: f,
              line: index + 1,
              code: trimmed,
              domain: domainName,
              forbidden,
            });
          }
        }
      }
    });
  }
  return issues;
}

const bDoicelaCross = auditCrossImports('backend/src/doiceladev', 'doiceladev', ['kartex', 'portfolio']);
const bKartexCross = auditCrossImports('backend/src/kartex', 'kartex', ['doiceladev', 'portfolio']);
console.log('Backend DoicelaDev cross-domain imports:', bDoicelaCross.length === 0 ? 'CLEAN (0)' : bDoicelaCross);
console.log('Backend Kartex cross-domain imports:', bKartexCross.length === 0 ? 'CLEAN (0)' : bKartexCross);

const fDoicelaCross = auditCrossImports('frontend/web/src/app/(doiceladev)', 'doiceladev', ['kartex', 'portfolio', 'landing']);
const fKartexCross = auditCrossImports('frontend/web/src/app/(kartex)', 'kartex', ['doiceladev', 'portfolio', 'landing']);
console.log('Frontend DoicelaDev cross-domain imports:', fDoicelaCross.length === 0 ? 'CLEAN (0)' : fDoicelaCross);
console.log('Frontend Kartex cross-domain imports:', fKartexCross.length === 0 ? 'CLEAN (0)' : fKartexCross);

// ─────────────────────────────────────────────────────────────
// 2. FEATURE-SLICED DESIGN (JERARQUIA DE CAPAS)
// ─────────────────────────────────────────────────────────────
console.log('\n--- 2. AUDITORIA FSD (JERARQUIA DE CAPAS) ---');
// Regla FSD:
// app -> widgets -> features -> entities -> shared
// shared NO puede importar: entities, features, widgets, app
// entities NO puede importar: features, widgets, app
// features NO puede importar: widgets, app
// widgets NO puede importar: app (páginas/layouts)

function auditFSDHierarchy(projectDir) {
  const violations = [];
  const files = getFiles(projectDir);

  for (const f of files) {
    const rel = path.relative(projectDir, f).replace(/\\/g, '/');
    const parts = rel.split('/');
    const layer = parts[0]; // entities, features, widgets, shared, etc.

    const lines = fs.readFileSync(f, 'utf8').split('\n');
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith('import ') && !(trimmed.startsWith('export ') && trimmed.includes(' from '))) {
        return;
      }

      if (layer === 'shared') {
        if (line.includes('/entities/') || line.includes('/features/') || line.includes('/widgets/')) {
          violations.push({ file: rel, line: index + 1, code: trimmed, rule: 'shared no puede importar capas superiores' });
        }
      } else if (layer === 'entities') {
        if (line.includes('/features/') || line.includes('/widgets/')) {
          violations.push({ file: rel, line: index + 1, code: trimmed, rule: 'entities no puede importar features ni widgets' });
        }
      } else if (layer === 'features') {
        if (line.includes('/widgets/')) {
          violations.push({ file: rel, line: index + 1, code: trimmed, rule: 'features no puede importar widgets' });
        }
      }
    });
  }
  return violations;
}

const fsdDoicela = auditFSDHierarchy('frontend/web/src/app/(doiceladev)');
console.log('FSD Layer Violations in DoicelaDev:', fsdDoicela.length === 0 ? 'CLEAN (0)' : fsdDoicela);

const fsdKartex = auditFSDHierarchy('frontend/web/src/app/(kartex)');
console.log('FSD Layer Violations in Kartex:', fsdKartex.length === 0 ? 'CLEAN (0)' : fsdKartex);

// ─────────────────────────────────────────────────────────────
// 3. FSD AISLAMIENTO ENTRE FEATURES (CROSS-FEATURE IMPORTS)
// ─────────────────────────────────────────────────────────────
console.log('\n--- 3. AUDITORIA FSD (CERO ACOPLAMIENTO CROSS-FEATURE) ---');

function auditCrossFeature(projectDir) {
  const featDir = path.join(projectDir, 'features');
  if (!fs.existsSync(featDir)) return [];
  const features = fs.readdirSync(featDir).filter((f) => fs.statSync(path.join(featDir, f)).isDirectory());
  const issues = [];

  for (const feat of features) {
    const files = getFiles(path.join(featDir, feat));
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith('import ') && !(trimmed.startsWith('export ') && trimmed.includes(' from '))) return;

        for (const other of features) {
          if (other === feat) continue;
          if (line.includes(`/features/${other}`) || line.includes(`../${other}`)) {
            issues.push({
              feature: feat,
              file: path.relative(projectDir, f).replace(/\\/g, '/'),
              line: idx + 1,
              code: trimmed,
              rule: `Feature "${feat}" no debe importar de feature hermana "${other}"`,
            });
          }
        }
      });
    }
  }
  return issues;
}

const crossFeatDoicela = auditCrossFeature('frontend/web/src/app/(doiceladev)');
console.log('Cross-Feature Violations in DoicelaDev:', crossFeatDoicela.length === 0 ? 'CLEAN (0)' : crossFeatDoicela);

const crossFeatKartex = auditCrossFeature('frontend/web/src/app/(kartex)');
console.log('Cross-Feature Violations in Kartex:', crossFeatKartex.length === 0 ? 'CLEAN (0)' : crossFeatKartex);

// ─────────────────────────────────────────────────────────────
// 4. AUDITORIA CAPAS BACKEND NESTJS (3 CAPAS CANONICAS)
// ─────────────────────────────────────────────────────────────
console.log('\n--- 4. AUDITORIA BACKEND NESTJS (3 CAPAS: CONTROLLER -> SERVICE -> REPOSITORY/ENTITY) ---');

function auditNestJSLayers(domainDir) {
  const violations = [];
  const files = getFiles(domainDir);

  for (const f of files) {
    const rel = path.relative(domainDir, f).replace(/\\/g, '/');
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');

    const isController = f.endsWith('.controller.ts') || rel.includes('/controllers/');
    const isService = f.endsWith('.service.ts') || rel.includes('/services/');
    const isEntity = f.endsWith('.entity.ts') || rel.includes('/entities/');

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith('import ') && !(trimmed.startsWith('export ') && trimmed.includes(' from '))) {
        return;
      }

      // Regla 1: Controllers no inyectan TypeORM ni Repositorios directamente
      if (isController) {
        if (line.includes('@InjectRepository') || line.includes('Repository<') || line.includes('@nestjs/typeorm')) {
          violations.push({
            file: rel,
            line: index + 1,
            code: trimmed,
            rule: 'Controllers no deben inyectar Repositorios TypeORM directamente; deben delegar en Services',
          });
        }
      }

      // Regla 2: Entities son agnósticas (no dependen de Services ni Controllers)
      if (isEntity) {
        if (line.includes('.service') || line.includes('.controller') || line.includes('/services/') || line.includes('/controllers/')) {
          violations.push({
            file: rel,
            line: index + 1,
            code: trimmed,
            rule: 'Entities no deben importar Services ni Controllers',
          });
        }
      }

      // Regla 3: Services no dependen de Controllers ni de decoradores de transporte HTTP
      if (isService) {
        if (line.includes('.controller') || line.includes('/controllers/')) {
          violations.push({
            file: rel,
            line: index + 1,
            code: trimmed,
            rule: 'Services no deben importar Controllers',
          });
        }
        if (line.includes('@Res(') || line.includes('@Req(') || line.includes('from \'express\'')) {
          violations.push({
            file: rel,
            line: index + 1,
            code: trimmed,
            rule: 'Services deben ser agnósticos al transporte HTTP (no usar @Req, @Res ni express)',
          });
        }
      }
    });
  }
  return violations;
}

const nestDoicela = auditNestJSLayers('backend/src/doiceladev');
console.log('NestJS 3-Layer Violations in DoicelaDev:', nestDoicela.length === 0 ? 'CLEAN (0)' : nestDoicela);

const nestKartex = auditNestJSLayers('backend/src/kartex');
console.log('NestJS 3-Layer Violations in Kartex:', nestKartex.length === 0 ? 'CLEAN (0)' : nestKartex);

// ─────────────────────────────────────────────────────────────
// 5. RESUMEN GLOBAL
// ─────────────────────────────────────────────────────────────
const totalIssues =
  bDoicelaCross.length +
  bKartexCross.length +
  fDoicelaCross.length +
  fKartexCross.length +
  fsdDoicela.length +
  fsdKartex.length +
  crossFeatDoicela.length +
  crossFeatKartex.length +
  nestDoicela.length +
  nestKartex.length;

console.log('\n================================================================');
if (totalIssues === 0) {
  console.log(' RESULTADO: ARQUITECTURA 100% VALIDA Y CERTIFICADA (0 VIOLACIONES)');
} else {
  console.log(` RESULTADO: ${totalIssues} VIOLACIONES ARQUITECTONICAS DETECTADAS`);
}
console.log('================================================================\n');

if (totalIssues > 0) {
  process.exit(1);
}
