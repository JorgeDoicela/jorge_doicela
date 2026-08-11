const { execSync } = require('child_process');

// Patrones de archivos que NUNCA deben comitearse
const FORBIDDEN_FILE_PATTERNS = [
  /^\.env(?!\.example$|\.template$)/i,
  /\.env\.(local|development|production|test)(\.local)?$/i,
  /\.(pem|key|crt|pfx|p12)$/i,
  /^id_rsa/i,
  /\.sqlite$/i,
];

// Reglas de inspección de contenido para líneas agregadas (+) en archivos staged
const SECRET_RULES = [
  {
    name: 'Llave Privada (SSH / RSA / EC / PGP)',
    regex: /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/,
  },
  {
    name: 'AWS Access Key ID',
    regex: /AKIA[0-9A-Z]{16}/,
  },
  {
    name: 'Google API Key',
    regex: /AIza[0-9A-Za-z_-]{35}/,
  },
  {
    name: 'GitHub Personal Access Token',
    regex: /(?:ghp_[0-9A-Za-z]{36}|github_pat_[0-9A-Za-z_]{82})/,
  },
  {
    name: 'Cadena de conexión a Base de Datos con credenciales',
    regex: /(?:mongodb(?:\+srv)?|postgres|postgresql|mysql|redis):\/\/[^:]+:[^@]+@/,
  },
  {
    name: 'Asignación de Secret / Password hardcoded',
    regex: /(?:password|secret|api_key|auth_token)\s*[:=]\s*["'](?!\$\{)[^"']{8,}["']/i,
  },
];

// Archivos o extensiones excluidas de la inspección de contenido
const IGNORED_FILES_FOR_CONTENT = [
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  'scripts/check-secrets.js',
  '.env.example',
  '.env.template',
];

function checkStagedFiles() {
  console.log('🔍 Escaneando archivos staged en busca de secretos y credenciales...');

  let stagedFilesStr = '';
  try {
    stagedFilesStr = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
  } catch (error) {
    console.error('❌ Error al obtener archivos staged de git.');
    process.exit(1);
  }

  const stagedFiles = stagedFilesStr.split(/\r?\n/).filter(Boolean);

  if (stagedFiles.length === 0) {
    console.log('✅ No hay archivos staged para escanear.');
    process.exit(0);
  }

  let hasErrors = false;

  // 1. Validar nombres de archivos prohibidos
  for (const file of stagedFiles) {
    for (const pattern of FORBIDDEN_FILE_PATTERNS) {
      if (pattern.test(file) || pattern.test(file.split('/').pop())) {
        console.error(`\n❌ [BLOQUEADO] Archivo restringido detectado en staging: "${file}"`);
        console.error(`   👉 Elimínalo del staging ejecutando: git restore --staged "${file}"`);
        hasErrors = true;
      }
    }
  }

  // 2. Escanear contenido de líneas agregadas en los diffs
  for (const file of stagedFiles) {
    if (IGNORED_FILES_FOR_CONTENT.some((ignored) => file.endsWith(ignored))) {
      continue;
    }

    try {
      const diff = execSync(`git diff --cached -U0 -- "${file}"`, { encoding: 'utf8' });
      const lines = diff.split(/\r?\n/);

      for (const line of lines) {
        // Solo analizar líneas agregadas que no sean comentarios o meta-datos del diff
        if (line.startsWith('+') && !line.startsWith('+++')) {
          const addedContent = line.substring(1);

          for (const rule of SECRET_RULES) {
            if (rule.regex.test(addedContent)) {
              console.error(`\n❌ [BLOQUEADO] Posible secreto detectado (${rule.name})`);
              console.error(`   Archivo: ${file}`);
              console.error(`   Línea agregada: ${addedContent.trim()}`);
              console.error(`   👉 Remueve el secreto antes de hacer commit.`);
              hasErrors = true;
            }
          }
        }
      }
    } catch (err) {
      // Ignorar archivos binarios o renombrados sin diff de texto
    }
  }

  if (hasErrors) {
    console.error('\n🛑 Commit cancelado por razones de seguridad.');
    process.exit(1);
  }

  console.log('✅ Escaneo de secretos finalizado sin hallazgos.');
  process.exit(0);
}

checkStagedFiles();
