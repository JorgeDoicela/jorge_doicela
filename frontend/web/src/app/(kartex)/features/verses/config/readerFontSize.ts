import { ReaderFontSize } from '../types';

export const MIN_READER_FONT_SIZE = 13;
export const MAX_READER_FONT_SIZE = 30;
export const DEFAULT_READER_FONT_SIZE = 18;

export const FONT_SIZE_PRESETS: Record<'sm' | 'md' | 'lg' | 'xl', number> = {
  sm: 15,
  md: 18,
  lg: 22,
  xl: 26,
};

/**
 * Normaliza cualquier valor de ReaderFontSize (número en px o siglas heredadas sm/md/lg/xl)
 * a un valor numérico entero en píxeles acotado entre MIN_READER_FONT_SIZE y MAX_READER_FONT_SIZE.
 */
export function normalizeFontSizeToPx(size: ReaderFontSize | undefined | null): number {
  if (typeof size === 'number' && !Number.isNaN(size)) {
    return Math.min(Math.max(Math.round(size), MIN_READER_FONT_SIZE), MAX_READER_FONT_SIZE);
  }
  if (typeof size === 'string' && size in FONT_SIZE_PRESETS) {
    return FONT_SIZE_PRESETS[size as keyof typeof FONT_SIZE_PRESETS];
  }
  return DEFAULT_READER_FONT_SIZE;
}

