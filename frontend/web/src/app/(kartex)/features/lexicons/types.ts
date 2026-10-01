export type HebrewLexiconSource = 'BDB' | 'Gesenius' | 'DTAT';
export type GreekLexiconSource = 'Thayer' | 'LSJ' | 'Robertson' | 'Vincent';

export interface HebrewDerivedWord {
  strong: string; // Ej. "H1254"
  wordHebrew: string; // Ej. "בָּרָא"
  transliteration: string; // Ej. "bara"
  partOfSpeech: string; // Ej. "Verbo Qal"
  gloss: string; // Ej. "crear, dar forma"
  occurrences: number; // Ej. 54
}

export interface HebrewLexiconEntry {
  id: string;
  root: string; // Raíz triconsonántica: ej. "ב-ר-א"
  rootTransliteration: string; // Ej. "b-r-'"
  strongPrimary: string; // Ej. "H1254"
  lemma: string; // Ej. "בָּרָא"
  language: 'Hebreo' | 'Arameo';
  partOfSpeech: string;
  gloss: string;
  occurrences: number;
  cognates?: string[]; // Cognados semíticos: ej. ["Ugarítico: br'", "Árabe: bara'a", "Arameo: בְּרָא"]
  derivedWords: HebrewDerivedWord[];

  // 1. Brown-Driver-Briggs (BDB)
  bdb: {
    rootEtymology: string;
    sections: {
      number: string; // Ej. "1", "2", "3"
      stem?: string; // Ej. "Qal", "Niphal", "Piel"
      definition: string;
      biblicalRefs: string[];
    }[];
  };

  // 2. Gesenius' Hebrew and Chaldee Lexicon
  gesenius: {
    philologicalNotes: string;
    derivationDiscussion: string;
    grammaticalForms: string[];
  };

  // 3. Diccionario Teológico del Antiguo Testamento (DTAT)
  dtat: {
    theologicalConcept: string;
    covenantContext: string;
    messianicTypology?: string;
  };
}

export interface GreekLexiconEntry {
  id: string;
  strong: string; // Ej. "G3056"
  lemma: string; // Ej. "λόγος"
  transliteration: string; // Ej. "logos"
  ipa: string; // Ej. "/ló.ɡos/"
  partOfSpeech: string;
  gloss: string;
  occurrences: number;
  rootOrOrigin: string; // Ej. "De G3004 (λέγω - hablar)"

  // 1. Thayer's Greek-English Lexicon
  thayer: {
    primaryMeaning: string;
    senses: {
      number: string;
      heading: string;
      details: string;
      biblicalRefs: string[];
    }[];
    prepositionalUsage?: string;
  };

  // 2. Liddell-Scott-Jones (LSJ) Condensado
  lsj: {
    classicalUsage: string;
    septuagintUsage: string;
    papyriContext: string;
  };

  // 3. Robertson's Word Pictures in the New Testament
  robertson: {
    keyPassages: {
      verseRef: string; // Ej. "Juan 1:1"
      grammaticalExegesis: string;
      historicalInsight: string;
    }[];
  };

  // 4. Vincent's Word Studies in the New Testament
  vincent: {
    wordStudies: {
      verseRef: string; // Ej. "Juan 1:1"
      pictorialMetaphor: string;
      culturalContext: string;
    }[];
  };
}

export type LexiconLanguageTab = 'hebrew' | 'greek';
