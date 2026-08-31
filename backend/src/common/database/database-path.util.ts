import * as path from 'path';
import * as fs from 'fs';

/**
 * Resuelve la ruta física absoluta a una base de datos SQLite.
 *
 * Garantiza determinismo absoluto:
 * 1. Si la variable de entorno es absoluta, la usa directamente.
 * 2. Si la variable de entorno es relativa (ej: './data/portfolio.sqlite'), la resuelve
 *    relativa al paquete backend sin importar desde dónde se ejecutó el proceso (root o backend).
 * 3. Si no existe variable de entorno, usa como fallback canónico `backend/data/<fileName>`.
 * 4. Crea el directorio padre de forma automática si no existe.
 */
export function resolveDatabasePath(
  envVarName: string,
  defaultFileName: string,
): string {
  const envValue = process.env[envVarName];
  let resolvedPath: string;

  if (envValue) {
    if (path.isAbsolute(envValue)) {
      resolvedPath = envValue;
    } else {
      const isMonorepoRoot = fs.existsSync(
        path.resolve(process.cwd(), 'backend'),
      );
      if (isMonorepoRoot && !envValue.startsWith('backend')) {
        resolvedPath = path.resolve(process.cwd(), 'backend', envValue);
      } else {
        resolvedPath = path.resolve(process.cwd(), envValue);
      }
    }
  } else {
    resolvedPath = path.resolve(__dirname, '../../../data', defaultFileName);
  }

  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return resolvedPath;
}
