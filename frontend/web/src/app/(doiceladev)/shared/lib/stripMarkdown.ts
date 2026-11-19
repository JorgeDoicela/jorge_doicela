/**
 * stripMarkdown - Sanitiza cadenas que contienen sintaxis Markdown (encabezados,
 * callouts de GitHub, citas, énfasis, enlaces, bloques de código, etc.)
 * transformándolas en texto plano limpio para tarjetas y sinopsis.
 */
export function stripMarkdown(raw?: string | null): string {
  if (!raw) return '';

  return raw
    // Imágenes: ![alt](url) -> eliminar
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Enlaces: [texto](url) -> texto
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Callouts de GitHub: > [!NOTE], > [!IMPORTANT], etc.
    .replace(/>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/gi, '')
    // Citas de bloque: > texto -> texto
    .replace(/^>\s*/gm, '')
    // Encabezados: # Titulo -> Titulo
    .replace(/^#{1,6}\s+/gm, '')
    // Negrita y cursiva
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Tachado: ~~texto~~ -> texto
    .replace(/~~(.*?)~~/g, '$1')
    // Bloques de código multilínea e inline
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
    // Reglas horizontales: ---, ***, ___
    .replace(/^[-*_]{3,}\s*$/gm, ' ')
    // Normalizar saltos de línea y espacios repetidos
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
