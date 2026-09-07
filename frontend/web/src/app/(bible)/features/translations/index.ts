export { TranslationSelector } from './components/translation-selector/TranslationSelector';
export { useTranslations } from './hooks/useTranslations';
export type { Translation } from './hooks/useTranslations';
export {
  getDefaultTranslationId,
  getSavedTranslationId,
  saveTranslationPreference,
  resolveInitialTranslationId,
  getTranslationLanguageGroup,
  DEFAULT_TRANSLATIONS,
  FALLBACK_DEFAULT_TRANSLATION_ID,
} from './utils/translationPreferences';

