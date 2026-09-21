'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { HebrewLexiconEntry, GreekLexiconEntry } from '../types';
import { fetchLexiconEntry, searchLexiconEntries } from '../services/lexiconApiService';
import { useBiblePassageSafe } from '../../../shared/context';

export interface CuratedTheologicalTerm {
  strong: string;
  lemma: string;
  transliteration: string;
  gloss: string;
  concept: string;
  language: 'hebrew' | 'greek';
  occurrences: number;
  keyPassages: string[];
}

export const CURATED_THEOLOGICAL_TERMS: CuratedTheologicalTerm[] = [
  // HEBREO / ANTIGUO TESTAMENTO
  {
    strong: 'H2617',
    lemma: 'חֶסֶד',
    transliteration: 'khesed',
    gloss: 'Misericordia de pacto, amor leal',
    concept: 'Fidelidad inquebrantable de Yahvéh a Su alianza con Su pueblo.',
    language: 'hebrew',
    occurrences: 248,
    keyPassages: ['Éxodo 34:6', 'Salmos 136:1', 'Oseas 6:6', 'Miqueas 6:8'],
  },
  {
    strong: 'H7965',
    lemma: 'שָׁלוֹם',
    transliteration: 'shalom',
    gloss: 'Paz integral, plenitud, bienestar',
    concept: 'Armonía total, salud, reconciliación y orden cósmico según el diseño divino.',
    language: 'hebrew',
    occurrences: 237,
    keyPassages: ['Números 6:26', 'Salmos 29:11', 'Isaías 9:6', 'Jeremías 29:11'],
  },
  {
    strong: 'H1254',
    lemma: 'בָּרָא',
    transliteration: 'bara',
    gloss: 'Crear de la nada, modelar',
    concept: 'Acción creadora soberana e inimitable reservada exclusivamente para Dios.',
    language: 'hebrew',
    occurrences: 54,
    keyPassages: ['Génesis 1:1', 'Salmos 51:10', 'Isaías 40:28', 'Isaías 65:17'],
  },
  {
    strong: 'H7725',
    lemma: 'שׁוּב',
    transliteration: 'shuv',
    gloss: 'Volver, retornar, arrepentirse',
    concept: 'Giro radical de 180 grados del corazón apartándose del mal hacia Dios.',
    language: 'hebrew',
    occurrences: 1059,
    keyPassages: ['Deuteronomio 30:2', 'Jeremías 3:12', 'Ezequiel 18:30', 'Malaquías 3:7'],
  },
  {
    strong: 'H6918',
    lemma: 'קָדוֹשׁ',
    transliteration: 'kadosh',
    gloss: 'Santo, apartado, trascendente',
    concept: 'Pureza moral absoluta y distancia ontológica de Dios respecto a la creación caída.',
    language: 'hebrew',
    occurrences: 117,
    keyPassages: ['Levítico 19:2', 'Isaías 6:3', 'Salmos 99:9', 'Habacuc 1:12'],
  },
  {
    strong: 'H1285',
    lemma: 'בְּרִית',
    transliteration: 'berit',
    gloss: 'Pacto, alianza soberana',
    concept: 'Compromiso vinculante sellado con sangre que define la relación entre Dios y los hombres.',
    language: 'hebrew',
    occurrences: 284,
    keyPassages: ['Génesis 15:18', 'Éxodo 24:8', 'Jeremías 31:31', 'Salmos 89:3'],
  },

  // GRIEGO / NUEVO TESTAMENTO
  {
    strong: 'G3056',
    lemma: 'λόγος',
    transliteration: 'logos',
    gloss: 'Palabra, Verbo divino, razón',
    concept: 'La expresión final y personal de la mente de Dios revelada en la encarnación de Cristo.',
    language: 'greek',
    occurrences: 330,
    keyPassages: ['Juan 1:1', 'Juan 1:14', '1 Juan 1:1', 'Hebreos 4:12'],
  },
  {
    strong: 'G26',
    lemma: 'ἀγάπη',
    transliteration: 'agape',
    gloss: 'Amor sacrificial incondicional',
    concept: 'Amor que busca activamente el bien supremo del otro sin esperar retribución.',
    language: 'greek',
    occurrences: 116,
    keyPassages: ['Romanos 5:8', '1 Corintios 13:4', '1 Juan 4:8', 'Gálatas 5:22'],
  },
  {
    strong: 'G5485',
    lemma: 'χάρις',
    transliteration: 'charis',
    gloss: 'Gracia, favor inmerecido',
    concept: 'Bondad libre, gratuita y eficaz de Dios derramada sobre el pecador indigno.',
    language: 'greek',
    occurrences: 155,
    keyPassages: ['Efesios 2:8', 'Romanos 3:24', 'Tito 2:11', '2 Corintios 12:9'],
  },
  {
    strong: 'G2842',
    lemma: 'κοινωνία',
    transliteration: 'koinonia',
    gloss: 'Comunión, participación íntima',
    concept: 'Unión fraternal y comunión espiritual de los creyentes en el Espíritu y con Cristo.',
    language: 'greek',
    occurrences: 19,
    keyPassages: ['Hechos 2:42', '1 Corintios 10:16', '2 Corintios 13:14', '1 Juan 1:3'],
  },
  {
    strong: 'G4151',
    lemma: 'πνεῦμα',
    transliteration: 'pneuma',
    gloss: 'Espíritu, aliento de vida',
    concept: 'La Tercera Persona de la Trinidad; poder vivificante que regenera y santifica.',
    language: 'greek',
    occurrences: 379,
    keyPassages: ['Juan 3:8', 'Romanos 8:9', 'Gálatas 5:16', 'Juan 14:26'],
  },
  {
    strong: 'G1343',
    lemma: 'δικαιοσύνη',
    transliteration: 'dikaiosyne',
    gloss: 'Justicia, justificación',
    concept: 'La rectitud legal y moral conferida e imputada por Dios a través de la fe en Jesucristo.',
    language: 'greek',
    occurrences: 92,
    keyPassages: ['Romanos 1:17', 'Romanos 3:21', '2 Corintios 5:21', 'Filipenses 3:9'],
  },
];

export interface LexiconContextValue {
  activeLanguage: 'hebrew' | 'greek';
  setActiveLanguage: (lang: 'hebrew' | 'greek') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStrongCode: string;
  setSelectedStrongCode: (code: string) => void;
  activeTerm: CuratedTheologicalTerm | null;
  selectTerm: (term: CuratedTheologicalTerm) => void;
  hebrewEntries: HebrewLexiconEntry[];
  greekEntries: GreekLexiconEntry[];
  isLoading: boolean;
  theologicalTerms: CuratedTheologicalTerm[];
}

const LexiconContext = createContext<LexiconContextValue | undefined>(undefined);

export const LexiconProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const passageContext = useBiblePassageSafe();
  const [activeLanguage, setActiveLanguageState] = useState<'hebrew' | 'greek'>('hebrew');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStrongCode, setSelectedStrongCode] = useState<string>(() => {
    return CURATED_THEOLOGICAL_TERMS.find((t) => t.language === 'hebrew')?.strong || '';
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setActiveLanguage = useCallback((lang: 'hebrew' | 'greek') => {
    setActiveLanguageState(lang);
    const firstTermForLang = CURATED_THEOLOGICAL_TERMS.find((t) => t.language === lang);
    if (firstTermForLang) {
      setSelectedStrongCode(firstTermForLang.strong);
    }
  }, []);

  const theologicalTerms = useMemo(() => {
    return CURATED_THEOLOGICAL_TERMS.filter((t) => t.language === activeLanguage);
  }, [activeLanguage]);

  const activeTerm = useMemo(() => {
    return (
      theologicalTerms.find((t) => t.strong === selectedStrongCode) ||
      theologicalTerms[0] ||
      null
    );
  }, [theologicalTerms, selectedStrongCode]);

  const selectTerm = useCallback(
    (term: CuratedTheologicalTerm) => {
      setSelectedStrongCode(term.strong);
      setActiveLanguageState(term.language);

      if (passageContext) {
        passageContext.openInspectorWithWord({
          strongNumber: term.strong,
          wordText: term.lemma,
          transliteration: term.transliteration,
          lemma: term.lemma,
          definition: term.gloss,
          language: term.language,
        });
      }
    },
    [passageContext],
  );

  const value: LexiconContextValue = {
    activeLanguage,
    setActiveLanguage,
    searchQuery,
    setSearchQuery,
    selectedStrongCode,
    setSelectedStrongCode,
    activeTerm,
    selectTerm,
    hebrewEntries: [],
    greekEntries: [],
    isLoading,
    theologicalTerms,
  };

  return <LexiconContext.Provider value={value}>{children}</LexiconContext.Provider>;
};

export function useLexiconContext(): LexiconContextValue {
  const context = useContext(LexiconContext);
  if (!context) {
    throw new Error('useLexiconContext debe ser utilizado dentro de un LexiconProvider');
  }
  return context;
}

export function useLexiconContextSafe(): LexiconContextValue | null {
  return useContext(LexiconContext) || null;
}
