/**
 * Sanitiza sintaxis Markdown (imágenes, enlaces, callouts de GitHub, citas,
 * encabezados, énfasis y bloques de código) en texto plano limpio para extractos
 * de listados y tarjetas editoriales.
 */
export function stripMarkdownToPlainText(
  text?: string | null,
  maxLength = 220,
): string {
  if (!text) return '';
  const clean = text
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/gi, '')
    .replace(/^>\s*/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
    .replace(/---+/g, ' ')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trimEnd() + '...';
}
