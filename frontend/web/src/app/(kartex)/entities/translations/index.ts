export { TranslationSelector } from './components/translation-selector/TranslationSelector';
export { MobileTranslationPopover } from './components/mobile-translation-popover/MobileTranslationPopover';
export type { MobileTranslationPopoverProps } from './components/mobile-translation-popover/MobileTranslationPopover';
export { useTranslations } from './hooks/useTranslations';
export type { Translation } from './types';
export {
  getDefaultTranslationId,
  getSavedTranslationId,
  saveTranslationPreference,
  resolveInitialTranslationId,
  getTranslationLanguageGroup,
  DEFAULT_TRANSLATIONS,
  FALLBACK_DEFAULT_TRANSLATION_ID,
} from './utils/translationPreferences';

