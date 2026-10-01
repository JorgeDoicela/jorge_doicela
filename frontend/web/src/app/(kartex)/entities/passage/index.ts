export {
  KartexPassageProvider,
  useKartexPassage,
  useKartexPassageSafe,
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  DEFAULT_RIGHT_INSPECTOR_WIDTH,
  MIN_LEFT_SIDEBAR_WIDTH,
  MAX_LEFT_SIDEBAR_WIDTH,
  MIN_RIGHT_INSPECTOR_WIDTH,
  MAX_RIGHT_INSPECTOR_WIDTH,
  AUTO_COLLAPSE_THRESHOLD,
  type InspectedWordData,
  type InspectedVerseData,
  type InspectorTab,
} from './model/KartexPassageContext';
export { ParallelVerseInspector, type ParallelVerseInspectorProps, type ParallelVerseData, type TargetTranslationItem } from './ui/ParallelVerseInspector';
export { StrongMorphologyInspector, type StrongMorphologyInspectorProps, type StrongLexiconEntryData } from './ui/StrongMorphologyInspector';
