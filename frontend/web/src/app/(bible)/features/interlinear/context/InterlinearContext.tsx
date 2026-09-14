'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  HebrewAramaicToken,
  GreekToken,
  InterlinearDisplaySettings,
  InterlinearVerse,
  GreekInterlinearVerse,
  StrongLexiconEntry,
  BiblicalLanguage,
} from '../types';
import { fetchInterlinearPassage, fetchStrongLexiconEntry } from '../services/interlinearApiService';
import { useBiblePassageSafe } from '../../../context/BiblePassageContext';

export interface InterlinearContextValue {
  settings: InterlinearDisplaySettings;
  setSettings: React.Dispatch<React.SetStateAction<InterlinearDisplaySettings>>;
  updateSettings: (partial: Partial<InterlinearDisplaySettings>) => void;
  activeCanon: 'OT' | 'NT';
  setActiveCanon: (canon: 'OT' | 'NT') => void;
  hebrewVerses: InterlinearVerse[];
  greekVerses: GreekInterlinearVerse[];
  isLoading: boolean;
  selectedToken: HebrewAramaicToken | GreekToken | null;
  selectedStrongEntry: StrongLexiconEntry | null;
  setSelectedStrongEntry: (entry: StrongLexiconEntry | null) => void;
  hoveredTokenId: string | null;
  setHoveredTokenId: (id: string | null) => void;
  selectToken: (token: HebrewAramaicToken | GreekToken) => Promise<void>;
  clearSelectedToken: () => void;
  activeLanguage: BiblicalLanguage;
  refetchPassage: () => Promise<void>;
}

const DEFAULT_SETTINGS: InterlinearDisplaySettings = {
  layout: 'reverse_interlinear',
  showNikkud: true,
  showTransliteration: true,
  showGloss: true,
  showStrong: true,
  showMorphologyTag: true,
  fontSize: 'xl',
  audioSpeed: 1.0,
};

const InterlinearContext = createContext<InterlinearContextValue | undefined>(undefined);

export const InterlinearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const passageContext = useBiblePassageSafe();
  const selectedBook = passageContext?.selectedBook;
  const bookAbbr = selectedBook?.abbreviation || 'GEN';
  const chapter = passageContext?.selectedChapter || 1;
  const testament = selectedBook?.testament;

  const [settings, setSettings] = useState<InterlinearDisplaySettings>(DEFAULT_SETTINGS);
  const [activeCanon, setActiveCanon] = useState<'OT' | 'NT'>('OT');
  const [hebrewVerses, setHebrewVerses] = useState<InterlinearVerse[]>([]);
  const [greekVerses, setGreekVerses] = useState<GreekInterlinearVerse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [hoveredTokenId, setHoveredTokenId] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<HebrewAramaicToken | GreekToken | null>(null);
  const [selectedStrongEntry, setSelectedStrongEntry] = useState<StrongLexiconEntry | null>(null);

  // Sincronizar automáticamente el canon con el libro seleccionado
  useEffect(() => {
    if (testament) {
      setActiveCanon(testament);
    } else if (bookAbbr) {
      const upper = bookAbbr.toUpperCase();
      if (upper === 'JN' || upper === 'ROM' || upper === 'MAT' || upper === 'JUA' || upper === 'APO') {
        setActiveCanon('NT');
      } else {
        setActiveCanon('OT');
      }
    }
  }, [bookAbbr, testament]);

  const loadPassage = useCallback(async () => {
    setIsLoading(true);
    try {
      const canon = testament || activeCanon;
      const data = await fetchInterlinearPassage(bookAbbr, chapter, canon);
      setHebrewVerses(data.hebrewVerses);
      setGreekVerses(data.greekVerses);

      // Si no hay token seleccionado, seleccionar por defecto el primer token disponible para el inspector
      const firstTok =
        canon === 'NT'
          ? data.greekVerses[0]?.tokens[0] ?? null
          : data.hebrewVerses[0]?.tokens[0] ?? null;

      if (firstTok) {
        setSelectedToken(firstTok);
        fetchStrongLexiconEntry(firstTok.strong).then((entry) => {
          setSelectedStrongEntry(entry);
        }).catch(() => {});
      }
    } catch (err) {
      console.error('[InterlinearContext] Error cargando pasaje:', err);
    } finally {
      setIsLoading(false);
    }
  }, [bookAbbr, chapter, testament, activeCanon]);

  useEffect(() => {
    void loadPassage();
  }, [loadPassage]);

  const updateSettings = useCallback((partial: Partial<InterlinearDisplaySettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const selectToken = useCallback(
    async (token: HebrewAramaicToken | GreekToken) => {
      setSelectedToken(token);
      try {
        const entry = await fetchStrongLexiconEntry(token.strong);
        setSelectedStrongEntry(entry);

        if (passageContext) {
          passageContext.openInspectorWithWord({
            strongNumber: token.strong,
            wordText: entry.lemma,
            transliteration: entry.transliteration,
            pronunciation: entry.pronunciationGuide,
            lemma: entry.lemma,
            definition: entry.shortDefinition,
            grammar: entry.partOfSpeech,
            language: token.strong.startsWith('H') ? 'hebrew' : 'greek',
          });
        }
      } catch (err) {
        console.error('[InterlinearContext] Error cargando entrada Strong:', err);
      }
    },
    [passageContext],
  );

  const clearSelectedToken = useCallback(() => {
    setSelectedToken(null);
    setSelectedStrongEntry(null);
  }, []);

  const activeLanguage: BiblicalLanguage = useMemo(() => {
    if (activeCanon === 'NT') return 'Greek';
    if (selectedToken && 'language' in selectedToken && selectedToken.language === 'Aramaic') {
      return 'Aramaic';
    }
    return 'Hebrew';
  }, [activeCanon, selectedToken]);

  const value: InterlinearContextValue = {
    settings,
    setSettings,
    updateSettings,
    activeCanon,
    setActiveCanon,
    hebrewVerses,
    greekVerses,
    isLoading,
    selectedToken,
    selectedStrongEntry,
    setSelectedStrongEntry,
    hoveredTokenId,
    setHoveredTokenId,
    selectToken,
    clearSelectedToken,
    activeLanguage,
    refetchPassage: loadPassage,
  };

  return <InterlinearContext.Provider value={value}>{children}</InterlinearContext.Provider>;
};

export function useInterlinearContext(): InterlinearContextValue {
  const context = useContext(InterlinearContext);
  if (!context) {
    throw new Error('useInterlinearContext debe ser utilizado dentro de un InterlinearProvider');
  }
  return context;
}

export function useInterlinearContextSafe(): InterlinearContextValue | null {
  return useContext(InterlinearContext) || null;
}
