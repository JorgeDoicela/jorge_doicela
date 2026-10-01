export type SemiticLanguage = 'Hebrew' | 'Aramaic';
export type BiblicalLanguage = 'Hebrew' | 'Aramaic' | 'Greek';

export interface StrongLexiconEntry {
  strong: string; // Ej. H7225 o G3056
  language: BiblicalLanguage;
  lemma: string; // Lema en grafía original (ej. רֵאשִׁית, λόγος)
  transliteration: string; // Transliteración académica (ej. rē’šîṯ, lógos)
  ipa: string; // Alfabeto Fonético Internacional (ej. /reːˈʃiːt/, /ˈlo.ɡos/)
  pronunciationGuide: string; // Guía fonética en español (ej. "ray-SHEET", "LOH-gohs")
  shortDefinition: string; // Definición concisa (Reina Valera / Diccionario)
  extendedDefinition: string[]; // Acepciones y desgloses exegéticos (BDB / Thayer)
  partOfSpeech: string; // Categoría gramatical
  root?: string; // Raíz trilítera o lema base (ej. ר-א-שׁ, λέγω)
  occurrencesInBible?: number; // Total de apariciones en el canon
  translationEquivalents?: string[]; // Principales traducciones al español
  theologicalSignificance?: string; // Nota de relevancia teológica o exegética
}

export interface HebrewAramaicToken {
  id: string;
  order: number;
  hebrew: string; // Vocalizado con Nikkud y cantilación masorética
  consonantsOnly: string; // Solo consonantes
  transliteration: string; // Transliteración académica fonética
  ipa?: string; // Fonética IPA exacta
  spanishSpan: string; // Fragmento de texto correspondiente en la traducción española
  gloss: string; // Traducción directa en español
  strong: string; // Código Strong (ej. H7225)
  language: SemiticLanguage;
  partOfSpeech: string; // Sustantivo, Verbo, Preposición, etc.
  root?: string; // Raíz trilítera (ej. ב-ר-א)
  binyan?: string; // Qal, Nif'al, Pi'el, etc. (Hebreo) o Pe'al, Pa'el, Af'el (Arameo)
  aspect?: string; // Perfecto (Qatal), Imperfecto (Yiqtol), Participio, etc.
  person?: string; // 1cs, 3ms, 3cp, etc.
  gender?: 'Masculino' | 'Femenino' | 'Común' | string;
  number?: 'Singular' | 'Plural' | 'Dual' | string;
  state?: 'Absoluto' | 'Constructo' | 'Enfático' | string;
  morphologyCode: string; // Etiqueta morfológica resumida (ej. V-Qal-Perf-3ms)
  notes?: string;
}

export interface GreekToken {
  id: string;
  order: number;
  greek: string; // Palabra en caracteres griegos con signos politónicos
  lemma: string; // Lema / forma de diccionario (ej. λόγος, εἰμί, θεός)
  transliteration: string; // Transliteración académica (ej. lógos, ēn, theós)
  ipa?: string; // Fonética IPA griega del siglo I
  spanishSpan: string; // Fragmento de texto correspondiente en español
  gloss: string; // Traducción contextual al español
  strong: string; // Código Strong Griego (ej. G3056)
  partOfSpeech: string; // Sustantivo, Verbo, Artículo, Conjunción, etc.
  case?: 'Nominativo' | 'Genitivo' | 'Dativo' | 'Acusativo' | 'Vocativo' | string;
  gender?: 'Masculino' | 'Femenino' | 'Neutro' | string;
  number?: 'Singular' | 'Plural' | string;
  tense?: 'Presente' | 'Imperfecto' | 'Futuro' | 'Aoristo' | 'Perfecto' | 'Pluscuamperfecto' | string;
  voice?: 'Activa' | 'Media' | 'Pasiva' | 'Media/Pasiva' | string;
  mood?: 'Indicativo' | 'Subjuntivo' | 'Imperativo' | 'Participio' | 'Infinitivo' | 'Optativo' | string;
  person?: '1ª persona' | '2ª persona' | '3ª persona' | string;
  morphologyCode: string; // Código Robinson estándar (ej. V-IAI-3S, N-NSM, T-NSM)
  parsingSummary: string; // Resumen legible (ej. Verbo Imperfecto Activo Indicativo 3ª sing.)
  notes?: string;
}

export interface InterlinearVerse {
  bookAbbreviation: string;
  bookName: string;
  chapter: number;
  verseNumber: number;
  language: SemiticLanguage;
  spanishText?: string; // Texto completo en español para el interlineal inverso
  isAramaicSection?: boolean;
  aramaicContextNote?: string;
  tokens: HebrewAramaicToken[];
}

export interface GreekInterlinearVerse {
  bookAbbreviation: string;
  bookName: string;
  chapter: number;
  verseNumber: number;
  language: 'Greek';
  spanishText?: string; // Texto completo en español para el interlineal inverso
  textusReceptusNote?: string;
  tokens: GreekToken[];
}

export type InterlinearViewLayout = 'cards' | 'reverse_interlinear' | 'split_matrix';

export interface InterlinearDisplaySettings {
  layout: InterlinearViewLayout;
  showNikkud: boolean;
  showTransliteration: boolean;
  showGloss: boolean;
  showStrong: boolean;
  showMorphologyTag: boolean;
  fontSize: 'base' | 'lg' | 'xl' | '2xl';
  audioSpeed: number; // 0.75 | 1.0
}

