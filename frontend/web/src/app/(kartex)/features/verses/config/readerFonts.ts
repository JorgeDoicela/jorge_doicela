/**
 * Registro Oficial de Tipografías del Lector Bíblico de Kartex.
 *
 * Arquitectura Extensible de Tipografías:
 * Para registrar una nueva fuente en el lector bíblico sin parches:
 * 1. Colocar el archivo de fuente (WOFF2/TTF) en `src/app/(kartex)/fonts/` (licencia libre SIL OFL).
 * 2. Registrar el `localFont` en `src/app/(kartex)/layout.tsx` e inyectar su CSS variable en <html>.
 * 3. Mapear la variable en `src/app/(kartex)/globals.css` dentro de `@theme` (ej. `--font-literata`).
 * 4. Añadir una nueva entrada en el arreglo `READER_FONTS` en este archivo.
 * 5. Agregar las traducciones correspondientes en `messages/es.json` y `messages/en.json` (namespace 'Toolbar').
 *
 * Todos los selectores de apariencia (desktop y móvil), vistas de lectura (continua y versículo a versículo)
 * y persistencia en localStorage consumirán la nueva fuente de forma 100% reactiva y tipada.
 */

export interface ReaderFontDefinition {
  /** Identificador único persistido en ReaderSettings y localStorage */
  id: string;
  /** Clave en el diccionario de traducción i18n (namespace 'Toolbar') */
  labelKey: string;
  /** Nombre visible por defecto si no existe traducción */
  defaultLabel: string;
  /** Clase utilitaria de Tailwind / CSS aplicada al texto bíblico y perícopas */
  cssClass: string;
  /** Variable CSS asociada en layout / globals.css */
  cssVariable: string;
  /** Familia formal (serif o sans) */
  category: 'serif' | 'sans';
  /** Breve descripción didáctica del estilo */
  description?: string;
}

export const READER_FONTS: readonly ReaderFontDefinition[] = [
  {
    id: 'serif',
    labelKey: 'serif',
    defaultLabel: 'Lora (Serif)',
    cssClass: 'font-serif',
    cssVariable: '--font-lora',
    category: 'serif',
    description: 'Tipografía clásica editorial con serifs de alto contraste y caligrafía viva.',
  },
  {
    id: 'sans',
    labelKey: 'sans',
    defaultLabel: 'Geist (Sans)',
    cssClass: 'font-sans',
    cssVariable: '--font-geist-sans',
    category: 'sans',
    description: 'Tipografía lineal de alta precisión geométrica y legibilidad en pantallas.',
  },
  {
    id: 'cardo',
    labelKey: 'cardo',
    defaultLabel: 'Cardo (Clásica)',
    cssClass: 'font-cardo',
    cssVariable: '--font-greek',
    category: 'serif',
    description: 'Tipografía académica inspirada en las ediciones de Aldo Manucio, diseñada para humanidades y textos bíblicos.',
  },
] as const;

export type ReaderFontId = 'serif' | 'sans' | 'cardo' | (string & {});
export type ReaderFontFamily = ReaderFontId;

export const DEFAULT_READER_FONT_ID: ReaderFontFamily = 'serif';

/**
 * Obtiene la definición completa de una fuente registrada.
 * Si el ID no existe en el catálogo, retorna la fuente por defecto (Lora).
 */
export function getReaderFontDefinition(fontId?: string | null): ReaderFontDefinition {
  if (!fontId) return READER_FONTS[0];
  const found = READER_FONTS.find((f) => f.id === fontId);
  return found || READER_FONTS[0];
}

/**
 * Obtiene la clase CSS (Tailwind) asociada a la familia tipográfica activa.
 * Garantiza que tanto las perícopas como los versículos utilicen exactamente la misma clase.
 */
export function getReaderFontClass(fontId?: string | null): string {
  return getReaderFontDefinition(fontId).cssClass;
}

/**
 * Valida si un identificador de fuente está registrado en el catálogo oficial.
 */
export function isValidReaderFont(fontId?: string | null): boolean {
  if (!fontId) return false;
  return READER_FONTS.some((f) => f.id === fontId);
}
