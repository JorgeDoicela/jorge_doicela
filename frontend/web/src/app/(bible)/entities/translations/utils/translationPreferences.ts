/**
 * Utilidades de gestión de preferencias y resolución inteligente de traducciones bíblicas.
 * Implementa la jerarquía de resolución estándar:
 * 1. Parámetro explícito de URL (?trans=X)
 * 2. Preferencia persistida en localStorage (por idioma o global)
 * 3. Default contextual por idioma activo (es -> NBLA [id: 3], en -> NIV [id: 5])
 */

export const STORAGE_KEY_TRANSLATION_GLOBAL = 'bible_last_translation_id';
export const getStorageKeyForLocale = (locale: string) => `bible_last_translation_${locale}`;

export const DEFAULT_TRANSLATIONS = {
  ES: 3, // Nueva Biblia de las Américas (NBLA)
  EN: 5, // New International Version (NIV)
} as const;

export const FALLBACK_DEFAULT_TRANSLATION_ID = DEFAULT_TRANSLATIONS.ES;

/**
 * Determina el grupo lingüístico al que pertenece una traducción.
 * id 1 (BHS) / id 2 (NA28) -> ancient (textos fuente)
 * id 3 (NBLA) / id 4 (NTV) / id 6 (RV1909) -> es
 * id 5 (NIV) -> en
 */
export function getTranslationLanguageGroup(translationId: number): 'es' | 'en' | 'ancient' {
  if (translationId === 1 || translationId === 2) {
    return 'ancient';
  }
  if (translationId === 5) {
    return 'en';
  }
  return 'es';
}

/**
 * Obtiene el ID por defecto según el locale (es -> NBLA [3], en -> NIV [5]).
 */
export function getDefaultTranslationId(locale?: string): number {
  if (locale && locale.toLowerCase().startsWith('en')) {
    return DEFAULT_TRANSLATIONS.EN;
  }
  return DEFAULT_TRANSLATIONS.ES;
}

/**
 * Recupera la preferencia guardada en localStorage para el idioma solicitado.
 */
export function getSavedTranslationId(locale?: string): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const cleanLocale = locale && locale.toLowerCase().startsWith('en') ? 'en' : 'es';
    const localeSaved = window.localStorage.getItem(getStorageKeyForLocale(cleanLocale));
    if (localeSaved) {
      const parsed = parseInt(localeSaved, 10);
      if (!isNaN(parsed) && parsed > 0) {
        // Validar que la traducción guardada coincida con el idioma o sea texto original
        const group = getTranslationLanguageGroup(parsed);
        if (group === cleanLocale || group === 'ancient') {
          return parsed;
        }
      }
    }
  } catch {
    // Fallback silencioso si localStorage está restringido
  }

  return null;
}

/**
 * Guarda la traducción seleccionada asociándola a su respectivo grupo idiomático.
 */
export function saveTranslationPreference(translationId: number, locale?: string): void {
  if (typeof window === 'undefined') return;

  try {
    const group = getTranslationLanguageGroup(translationId);
    const targetLocale = group === 'ancient'
      ? (locale && locale.toLowerCase().startsWith('en') ? 'en' : 'es')
      : group;

    window.localStorage.setItem(STORAGE_KEY_TRANSLATION_GLOBAL, translationId.toString());
    window.localStorage.setItem(getStorageKeyForLocale(targetLocale), translationId.toString());
  } catch {
    // Fallback silencioso
  }
}

/**
 * Resuelve la traducción inicial siguiendo la jerarquía inteligente:
 * 1. urlParam (solo si coincide con el locale activo o es texto antiguo BHS/NA28)
 * 2. Preferencia de localStorage para el idioma activo
 * 3. Default contextual: Español -> NBLA (3), Inglés -> NIV (5)
 */
export function resolveInitialTranslationId(options?: {
  urlParam?: string | null;
  locale?: string;
  checkStorage?: boolean;
}): number {
  const { urlParam, locale, checkStorage = false } = options || {};
  const cleanLocale = locale && locale.toLowerCase().startsWith('en') ? 'en' : 'es';

  // 1. Prioridad URL (respetada si es coherente con el idioma activo o es texto fuente)
  if (urlParam) {
    const parsed = parseInt(urlParam, 10);
    if (!isNaN(parsed) && parsed > 0) {
      const group = getTranslationLanguageGroup(parsed);
      if (group === cleanLocale || group === 'ancient') {
        return parsed;
      }
    }
  }

  // 2. Prioridad Memoria Local del usuario (solo post-hidratación con checkStorage: true)
  if (checkStorage) {
    const saved = getSavedTranslationId(cleanLocale);
    if (saved !== null) {
      return saved;
    }
  }

  // 3. Default Contextual por idioma (100% determinista en SSR y cliente)
  return getDefaultTranslationId(cleanLocale);
}
