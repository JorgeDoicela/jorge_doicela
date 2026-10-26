'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useBooks, Book } from '../../books';
import { getChaptersForBookId } from '../../../shared/data/canonData';
import {
  useTranslations,
  Translation,
  resolveInitialTranslationId,
  saveTranslationPreference,
  getDefaultTranslationId,
  getSavedTranslationId,
  getTranslationLanguageGroup,
} from '../../translations';
import { useKartexKeybindings } from '../../../shared/hooks/useKartexKeybindings';
import {
  StudySidePanelContextProvider,
  type StudySidePanelContextValue,
} from '../../../shared/ui';

export interface InspectedWordData {
  strongNumber: string;
  wordText: string;
  transliteration?: string;
  pronunciation?: string;
  lemma?: string;
  definition?: string;
  grammar?: string;
  language?: 'hebrew' | 'greek' | 'aramaic';
}

export interface InspectedVerseData {
  bookId: number;
  bookName: string;
  chapter: number;
  verseNumber: number;
  text: string;
}

export type InspectorTab = 'strong' | 'versions' | 'historical' | 'apologetics' | 'notes';

interface KartexPassageContextValue {
  books: Book[];
  translations: Translation[];
  selectedBookId: number;
  selectedChapter: number;
  selectedTranslationId: number | null;
  selectedBook?: Book;
  activeTranslation?: Translation;
  setPassage: (bookId: number, chapter: number) => void;
  setSelectedTranslationId: (id: number | null) => void;
  nextChapter: () => void;
  prevChapter: () => void;

  // Control de visibilidad del Header Superior sincronizado con el scroll
  isHeaderVisible: boolean;
  setIsHeaderVisible: (visible: boolean) => void;

  // Control de Paneles Laterales del Workspace Studio
  isLeftSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  setLeftSidebarOpen: (open: boolean) => void;
  leftSidebarWidth: number;
  setLeftSidebarWidth: (width: number) => void;
  resetLeftSidebarWidth: () => void;

  isRightInspectorOpen: boolean;
  toggleRightInspector: () => void;
  setRightInspectorOpen: (open: boolean) => void;
  rightInspectorWidth: number;
  setRightInspectorWidth: (width: number) => void;
  resetRightInspectorWidth: () => void;
  activeInspectorTab: InspectorTab;
  setActiveInspectorTab: (tab: InspectorTab) => void;

  inspectedWord: InspectedWordData | null;
  inspectedVerse: InspectedVerseData | null;
  setInspectedVerse: (verse: InspectedVerseData | null) => void;
  openInspectorWithWord: (word: InspectedWordData) => void;
  openInspectorWithVerse: (verse: InspectedVerseData) => void;
  clearInspectedVerse: () => void;
  closeInspector: () => void;

  // Reproductor de Audio Bíblico Nativo (Web Speech API Accesible y de Alta Fidelidad)
  isPlayingAudio: boolean;
  isAudioPaused: boolean;
  currentAudioVerse: number | null;
  audioSpeed: number;
  setAudioSpeed: (speed: number) => void;
  sleepTimerMinutes: number | null;
  sleepTimerRemainingSeconds: number | null;
  setSleepTimer: (minutes: number | null) => void;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceURI: string | null;
  setSelectedVoiceURI: (uri: string | null) => void;
  playNextVerse: () => void;
  playPrevVerse: () => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  toggleAudio: (verses?: { verseNumber: number; text: string }[]) => void;
  stopAudio: () => void;
}

export const DEFAULT_LEFT_SIDEBAR_WIDTH = 280;
export const DEFAULT_RIGHT_INSPECTOR_WIDTH = 340;
export const MIN_LEFT_SIDEBAR_WIDTH = 200;
export const MAX_LEFT_SIDEBAR_WIDTH = 480;
export const MIN_RIGHT_INSPECTOR_WIDTH = 200;
export const MAX_RIGHT_INSPECTOR_WIDTH = 480;
export const AUTO_COLLAPSE_THRESHOLD = 175;

const KartexPassageContext = createContext<KartexPassageContextValue | undefined>(undefined);

interface KartexPassageProviderProps {
  children: ReactNode;
}

export const KartexPassageProvider: React.FC<KartexPassageProviderProps> = ({ children }) => {
  const searchParams = useSearchParams();
  const locale = useLocale();

  const { books } = useBooks();
  const { translations } = useTranslations();

  // Obtener estado inicial desde URL query params si existen
  const initialBookParam = searchParams.get('book');
  const initialChapterParam = searchParams.get('chapter');
  const initialTransParam = searchParams.get('trans');

  const [selectedBookId, setSelectedBookId] = useState<number>(() => {
    if (initialBookParam) {
      const parsed = parseInt(initialBookParam, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 1; // Génesis por defecto
  });

  const [selectedChapter, setSelectedChapter] = useState<number>(() => {
    if (initialChapterParam) {
      const parsed = parseInt(initialChapterParam, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 1;
  });

  // Resolución profesional y determinista para SSR:
  // 1) URL Param -> 2) Default Contextual del Locale (ES: NBLA [3], EN: NIV [5])
  // La memoria secundaria de localStorage se sincroniza post-hidratación para evitar Hydration Mismatches
  const [selectedTranslationId, setSelectedTranslationId] = useState<number | null>(() => {
    return resolveInitialTranslationId({
      urlParam: initialTransParam,
      locale,
    });
  });

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) || books[0],
    [books, selectedBookId]
  );

  const activeTranslation = useMemo(
    () => translations.find((t) => t.id === selectedTranslationId) || translations[0],
    [translations, selectedTranslationId]
  );

  // Control de Paneles Laterales (Dimensiones Redimensionables y Visibilidad):
  // En PC (>= 1024px) ambos laterales abren automáticamente por defecto para ofrecer la suite de estudio completa;
  // En Móvil (< 1024px) NINGÚN lateral se abre automáticamente al ingresar para mantener la pantalla 100% despejada
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(false);
  const [isRightInspectorOpen, setIsRightInspectorOpen] = useState<boolean>(false);

  const [leftSidebarWidth, setLeftSidebarWidthState] = useState<number>(DEFAULT_LEFT_SIDEBAR_WIDTH);
  const [rightInspectorWidth, setRightInspectorWidthState] = useState<number>(DEFAULT_RIGHT_INSPECTOR_WIDTH);

  const setLeftSidebarWidth = useCallback((width: number) => {
    const max = typeof window !== 'undefined' ? Math.min(MAX_LEFT_SIDEBAR_WIDTH, Math.max(MIN_LEFT_SIDEBAR_WIDTH, Math.round(window.innerWidth * 0.38))) : MAX_LEFT_SIDEBAR_WIDTH;
    const clamped = Math.max(120, Math.min(width, max));
    setLeftSidebarWidthState(clamped);
  }, []);

  const resetLeftSidebarWidth = useCallback(() => {
    setLeftSidebarWidthState(DEFAULT_LEFT_SIDEBAR_WIDTH);
  }, []);

  const setRightInspectorWidth = useCallback((width: number) => {
    const max = typeof window !== 'undefined' ? Math.min(MAX_RIGHT_INSPECTOR_WIDTH, Math.max(MIN_RIGHT_INSPECTOR_WIDTH, Math.round(window.innerWidth * 0.38))) : MAX_RIGHT_INSPECTOR_WIDTH;
    const clamped = Math.max(120, Math.min(width, max));
    setRightInspectorWidthState(clamped);
  }, []);

  const resetRightInspectorWidth = useCallback(() => {
    setRightInspectorWidthState(DEFAULT_RIGHT_INSPECTOR_WIDTH);
  }, []);

  // Sincronización post-montaje con la traducción contextual
  useEffect(() => {
    // Si no hubo ?trans= en la URL, verificar si el usuario tiene una traducción guardada
    if (!initialTransParam) {
      const savedTrans = getSavedTranslationId(locale);
      if (savedTrans !== null) {
        setSelectedTranslationId(savedTrans);
      }
    }
  }, [initialTransParam, locale]);

  // Transición reactiva y fluida entre PC y Móvil al redimensionar la ventana y montaje inicial en escritorio
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Inicialización al montar en cliente:
    // En PC (>= 1024px): Ambos laterales inician abiertos automáticamente por defecto (o según preferencia del usuario en PC).
    // En Móvil (< 1024px): NINGÚN lateral se abre automáticamente al ingresar para mantener la pantalla 100% despejada.
    if (window.innerWidth >= 1024) {
      try {
        const savedLeft = localStorage.getItem('kartex_left_sidebar_open');
        setIsLeftSidebarOpen(savedLeft !== null ? savedLeft === 'true' : true);
      } catch {
        setIsLeftSidebarOpen(true);
      }

      try {
        const savedRight = localStorage.getItem('kartex_right_inspector_open');
        setIsRightInspectorOpen(savedRight !== null ? savedRight === 'true' : true);
      } catch {
        setIsRightInspectorOpen(true);
      }
    } else {
      setIsLeftSidebarOpen(false);
      setIsRightInspectorOpen(false);
    }

    let prevWidth = window.innerWidth;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const wasDesktop = prevWidth >= 1024;
      const isDesktop = currentWidth >= 1024;

      if (wasDesktop && !isDesktop) {
        // Al pasar de PC a móvil, colapsar ambos laterales para despejar la lectura táctil
        setIsLeftSidebarOpen(false);
        setIsRightInspectorOpen(false);
      } else if (!wasDesktop && isDesktop) {
        // Al volver a PC, restaurar ambos laterales según preferencia guardada en PC (abiertos por defecto)
        try {
          const savedLeft = localStorage.getItem('kartex_left_sidebar_open');
          setIsLeftSidebarOpen(savedLeft !== null ? savedLeft === 'true' : true);
        } catch {
          setIsLeftSidebarOpen(true);
        }

        try {
          const savedRight = localStorage.getItem('kartex_right_inspector_open');
          setIsRightInspectorOpen(savedRight !== null ? savedRight === 'true' : true);
        } catch {
          setIsRightInspectorOpen(true);
        }
      }

      prevWidth = currentWidth;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLeftSidebar = useCallback(() => {
    setIsLeftSidebarOpen((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) {
          try {
            localStorage.setItem('kartex_left_sidebar_open', String(next));
          } catch {
            // fallback
          }
        } else if (next) {
          // En móvil (< 1024px), si se abre el panel izquierdo, cerrar el inspector derecho para evitar superposición
          setIsRightInspectorOpen(false);
        }
      }
      return next;
    });
  }, []);

  const setLeftSidebarOpen = useCallback((open: boolean) => {
    setIsLeftSidebarOpen(open);
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        try {
          localStorage.setItem('kartex_left_sidebar_open', String(open));
        } catch {
          // fallback
        }
      } else if (open) {
        setIsRightInspectorOpen(false);
      }
    }
  }, []);

  const [activeInspectorTab, setActiveInspectorTab] = useState<InspectorTab>('versions');
  const [inspectedWord, setInspectedWord] = useState<InspectedWordData | null>(null);
  const [inspectedVerse, setInspectedVerse] = useState<InspectedVerseData | null>(null);

  // Limpiar el versículo inspeccionado al cambiar de libro o capítulo si ya no pertenece al pasaje actual
  useEffect(() => {
    setInspectedVerse((prev) => {
      if (prev && (prev.bookId !== selectedBookId || prev.chapter !== selectedChapter)) {
        return null;
      }
      return prev;
    });
  }, [selectedBookId, selectedChapter]);

  const toggleRightInspector = useCallback(() => {
    setIsRightInspectorOpen((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) {
          try {
            localStorage.setItem('kartex_right_inspector_open', String(next));
          } catch {
            // fallback
          }
        } else if (next) {
          // En móvil (< 1024px), si se abre el inspector derecho, cerrar el panel izquierdo para evitar superposición
          setIsLeftSidebarOpen(false);
        }
      }
      return next;
    });
  }, []);

  const openInspectorWithWord = useCallback((word: InspectedWordData) => {
    setInspectedWord(word);
    setActiveInspectorTab('strong');
    setIsRightInspectorOpen(true);
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        try {
          localStorage.setItem('kartex_right_inspector_open', 'true');
        } catch {
          // Ignorar fallo de almacenamiento en modo incógnito
        }
      } else {
        setIsLeftSidebarOpen(false);
      }
    }
  }, []);

  const openInspectorWithVerse = useCallback((verse: InspectedVerseData) => {
    setInspectedVerse(verse);
    setActiveInspectorTab('versions');
    setIsRightInspectorOpen(true);
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        try {
          localStorage.setItem('kartex_right_inspector_open', 'true');
        } catch {
          // Ignorar fallo de almacenamiento en modo incógnito
        }
      } else {
        setIsLeftSidebarOpen(false);
      }
    }
  }, []);

  const clearInspectedVerse = useCallback(() => {
    setInspectedVerse(null);
  }, []);

  const setRightInspectorOpen = useCallback((open: boolean) => {
    setIsRightInspectorOpen(open);
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        try {
          localStorage.setItem('kartex_right_inspector_open', String(open));
        } catch {
          // fallback
        }
      } else if (open) {
        setIsLeftSidebarOpen(false);
      }
    }
  }, []);

  // Control de visibilidad del Header Superior sincronizado con el scroll
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);

  const closeInspector = useCallback(() => {
    setIsRightInspectorOpen(false);
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      try {
        localStorage.setItem('kartex_right_inspector_open', 'false');
      } catch {
        // Ignorar fallo de almacenamiento en modo incógnito
      }
    }
  }, []);

  // Sincronizar cambios en la barra de URL de forma determinista (0 ms) sin activar el enrutador asíncrono de Next.js ni suspense
  const updateUrlParams = useCallback((bookId: number, chapter: number, transId: number | null) => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('book', bookId.toString());
      url.searchParams.set('chapter', chapter.toString());
      if (transId) {
        url.searchParams.set('trans', transId.toString());
      } else {
        url.searchParams.delete('trans');
      }
      window.history.replaceState(window.history.state, '', url.pathname + url.search);
    } catch {
      // Ignorar fallback seguro
    }
  }, []);

  // Reaccionar al cambio de idioma de la interfaz (ES <-> EN) de manera inmediata y fluida
  useEffect(() => {
    const cleanLocale = locale && locale.toLowerCase().startsWith('en') ? 'en' : 'es';
    const currentGroup = selectedTranslationId
      ? getTranslationLanguageGroup(selectedTranslationId)
      : null;

    // Si la traducción actual pertenece a un idioma distinto al nuevo locale de la app
    if (currentGroup && currentGroup !== 'ancient' && currentGroup !== cleanLocale) {
      const preferredId = resolveInitialTranslationId({ locale: cleanLocale });
      setSelectedTranslationId(preferredId);
      updateUrlParams(selectedBookId, selectedChapter, preferredId);
    }
  }, [locale, selectedTranslationId, selectedBookId, selectedChapter, updateUrlParams]);

  // Manejar navegación nativa del navegador (Botón Atrás / Adelante vía popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const bookParam = params.get('book');
      const chapterParam = params.get('chapter');
      const transParam = params.get('trans');

      if (bookParam) {
        const parsedBook = parseInt(bookParam, 10);
        if (!isNaN(parsedBook) && parsedBook > 0) {
          setSelectedBookId(parsedBook);
        }
      }

      if (chapterParam) {
        const parsedChap = parseInt(chapterParam, 10);
        if (!isNaN(parsedChap) && parsedChap > 0) {
          setSelectedChapter(parsedChap);
        }
      }

      if (transParam) {
        const parsedTrans = parseInt(transParam, 10);
        if (!isNaN(parsedTrans) && parsedTrans > 0) {
          setSelectedTranslationId(parsedTrans);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sincronizar cuando se navega externamente a través de un <Link> entre módulos con query params
  const lastSynchronizedSearchRef = useRef<string>(searchParams.toString());
  useEffect(() => {
    const currentSearch = searchParams.toString();
    if (currentSearch === lastSynchronizedSearchRef.current) return;
    lastSynchronizedSearchRef.current = currentSearch;

    const bookParam = searchParams.get('book');
    const chapterParam = searchParams.get('chapter');
    if (!bookParam && !chapterParam) return;

    const parsedBookId = bookParam ? parseInt(bookParam, 10) : null;
    const parsedChapter = chapterParam ? parseInt(chapterParam, 10) : null;

    if (parsedBookId && !isNaN(parsedBookId) && parsedBookId > 0) {
      setSelectedBookId((prev) => (prev !== parsedBookId ? parsedBookId : prev));
    }
    if (parsedChapter && !isNaN(parsedChapter) && parsedChapter > 0) {
      setSelectedChapter((prev) => (prev !== parsedChapter ? parsedChapter : prev));
    }
  }, [searchParams]);

  // Control de Audio Bíblico Nativo (Web Speech API Accesible y de Alta Fidelidad)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const [currentAudioVerse, setCurrentAudioVerse] = useState<number | null>(null);
  const [audioSpeed, setAudioSpeedState] = useState<number>(1.0);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemainingSeconds, setSleepTimerRemainingSeconds] = useState<number | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURIState] = useState<string | null>(null);

  const audioQueueRef = useRef<{ verseNumber: number; text: string }[]>([]);
  const currentAudioIndexRef = useRef<number>(0);
  const audioSpeedRef = useRef<number>(1.0);
  const selectedVoiceURIRef = useRef<string | null>(null);

  // Mantener referencias actualizadas para callbacks asíncronos de SpeechSynthesis
  useEffect(() => {
    audioSpeedRef.current = audioSpeed;
  }, [audioSpeed]);

  useEffect(() => {
    selectedVoiceURIRef.current = selectedVoiceURI;
  }, [selectedVoiceURI]);

  // Recuperar preferencias de velocidad y voz desde localStorage post-hidratación
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedSpeed = localStorage.getItem('kartex_audio_speed');
      if (savedSpeed) {
        const parsed = parseFloat(savedSpeed);
        if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 3.0) {
          setAudioSpeedState(parsed);
          audioSpeedRef.current = parsed;
        }
      }
      const savedVoice = localStorage.getItem('kartex_audio_voice');
      if (savedVoice) {
        setSelectedVoiceURIState(savedVoice);
        selectedVoiceURIRef.current = savedVoice;
      }
    } catch {
      // Ignorar fallback seguro
    }
  }, []);

  // Inicializar y escuchar catálogo de voces del sistema operativo
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        // Deduplicar voces por voiceURI para evitar instancias duplicadas en Chromium/Windows
        const uniqueMap = new Map<string, SpeechSynthesisVoice>();
        for (const voice of allVoices) {
          const key = voice.voiceURI || `${voice.name}-${voice.lang}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, voice);
          }
        }
        setAvailableVoices(Array.from(uniqueMap.values()));
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Seleccionar la mejor voz neuronal disponible del dispositivo
  const getBestVoice = useCallback((lang: string = 'es'): SpeechSynthesisVoice | null => {
    const voices = availableVoices.length > 0
      ? availableVoices
      : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);

    if (voices.length === 0) return null;

    // Si el usuario seleccionó una voz explícita, priorizarla
    if (selectedVoiceURIRef.current) {
      const explicit = voices.find((v) => v.voiceURI === selectedVoiceURIRef.current);
      if (explicit) return explicit;
    }

    const cleanLang = lang.toLowerCase().startsWith('en') ? 'en' : 'es';
    const langVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(cleanLang));

    if (langVoices.length === 0) return voices[0] || null;

    // Prioridad 1: Voces Neuronales / Naturales / Online (Edge, Windows, macOS, Chrome)
    const neuralVoice = langVoices.find((v) => {
      const n = v.name.toLowerCase();
      return (
        n.includes('natural') ||
        n.includes('neural') ||
        n.includes('online') ||
        n.includes('enhanced') ||
        n.includes('mejorada')
      );
    });
    if (neuralVoice) return neuralVoice;

    // Prioridad 2: Voces de alta calidad Google / Apple / Microsoft
    const qualityVoice = langVoices.find((v) => {
      const n = v.name.toLowerCase();
      return (
        n.includes('google') ||
        n.includes('siri') ||
        n.includes('paulina') ||
        n.includes('mónica') ||
        n.includes('jorge') ||
        n.includes('alvaro')
      );
    });
    if (qualityVoice) return qualityVoice;

    return langVoices[0];
  }, [availableVoices]);

  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
    setCurrentAudioVerse(null);
    currentAudioIndexRef.current = 0;
    audioQueueRef.current = [];
    setSleepTimerMinutes(null);
    setSleepTimerRemainingSeconds(null);
  }, []);

  const playVerseAtIndex = useCallback((index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const queue = audioQueueRef.current;
    if (index >= queue.length) {
      stopAudio();
      return;
    }

    const item = queue[index];
    currentAudioIndexRef.current = index;
    setCurrentAudioVerse(item.verseNumber);
    setIsAudioPaused(false);

    // Sincronización visual y scroll suave con el versículo en reproducción
    if (typeof document !== 'undefined') {
      const verseEl = document.querySelector(`[data-verse-number="${item.verseNumber}"]`);
      if (verseEl) {
        verseEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(item.text);
    const targetLang = locale && locale.toLowerCase().startsWith('en') ? 'en-US' : 'es-ES';
    utterance.lang = targetLang;
    utterance.rate = audioSpeedRef.current;
    utterance.pitch = 1.0;

    const bestVoice = getBestVoice(targetLang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onend = () => {
      playVerseAtIndex(index + 1);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        stopAudio();
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [getBestVoice, locale, stopAudio]);

  const setAudioSpeed = useCallback((speed: number) => {
    setAudioSpeedState(speed);
    audioSpeedRef.current = speed;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kartex_audio_speed', String(speed));
      } catch {
        // Ignorar
      }
    }
    // Si se encuentra en reproducción activa, reiniciar el versículo actual con la nueva velocidad
    if (isPlayingAudio && !isAudioPaused && audioQueueRef.current.length > 0) {
      playVerseAtIndex(currentAudioIndexRef.current);
    }
  }, [isAudioPaused, isPlayingAudio, playVerseAtIndex]);

  const setSelectedVoiceURI = useCallback((uri: string | null) => {
    setSelectedVoiceURIState(uri);
    selectedVoiceURIRef.current = uri;
    if (typeof window !== 'undefined') {
      try {
        if (uri) {
          localStorage.setItem('kartex_audio_voice', uri);
        } else {
          localStorage.removeItem('kartex_audio_voice');
        }
      } catch {
        // Ignorar
      }
    }
    // Si está reproduciendo, reiniciar el versículo actual con el nuevo timbre de voz
    if (isPlayingAudio && !isAudioPaused && audioQueueRef.current.length > 0) {
      playVerseAtIndex(currentAudioIndexRef.current);
    }
  }, [isAudioPaused, isPlayingAudio, playVerseAtIndex]);

  const setSleepTimer = useCallback((minutes: number | null) => {
    setSleepTimerMinutes(minutes);
    if (minutes === null || minutes <= 0) {
      setSleepTimerRemainingSeconds(null);
    } else {
      setSleepTimerRemainingSeconds(minutes * 60);
    }
  }, []);

  // Temporizador regresivo de apagado de audio en segundo plano
  useEffect(() => {
    if (!isPlayingAudio || isAudioPaused || sleepTimerRemainingSeconds === null) return;
    if (sleepTimerRemainingSeconds <= 0) {
      stopAudio();
      return;
    }
    const interval = setInterval(() => {
      setSleepTimerRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          stopAudio();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlayingAudio, isAudioPaused, sleepTimerRemainingSeconds, stopAudio]);

  const pauseAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPlayingAudio && !isAudioPaused) {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
    }
  }, [isAudioPaused, isPlayingAudio]);

  const resumeAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPlayingAudio && isAudioPaused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
    }
  }, [isAudioPaused, isPlayingAudio]);

  const playNextVerse = useCallback(() => {
    if (audioQueueRef.current.length > 0) {
      const nextIdx = currentAudioIndexRef.current + 1;
      if (nextIdx < audioQueueRef.current.length) {
        playVerseAtIndex(nextIdx);
      } else {
        stopAudio();
      }
    }
  }, [playVerseAtIndex, stopAudio]);

  const playPrevVerse = useCallback(() => {
    if (audioQueueRef.current.length > 0) {
      const prevIdx = Math.max(0, currentAudioIndexRef.current - 1);
      playVerseAtIndex(prevIdx);
    }
  }, [playVerseAtIndex]);

  const toggleAudio = useCallback((explicitVerses?: { verseNumber: number; text: string }[]) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      if (isAudioPaused) {
        resumeAudio();
        return;
      }
      stopAudio();
      return;
    }

    let versesToPlay = explicitVerses;
    if (!versesToPlay || versesToPlay.length === 0) {
      const elements = document.querySelectorAll<HTMLElement>('[data-verse-item="true"]');
      const extracted: { verseNumber: number; text: string }[] = [];
      elements.forEach((el, idx) => {
        const numAttr = el.getAttribute('data-verse-number');
        const vNum = numAttr ? parseInt(numAttr, 10) : idx + 1;
        const clone = el.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('sup').forEach((sup) => sup.remove());
        const cleanText = clone.textContent?.trim();
        if (cleanText) {
          extracted.push({ verseNumber: vNum, text: cleanText });
        }
      });
      versesToPlay = extracted;
    }

    if (!versesToPlay || versesToPlay.length === 0) return;

    audioQueueRef.current = versesToPlay;
    currentAudioIndexRef.current = 0;
    setIsPlayingAudio(true);
    setIsAudioPaused(false);
    playVerseAtIndex(0);
  }, [isAudioPaused, isPlayingAudio, playVerseAtIndex, resumeAudio, stopAudio]);

  const setPassage = (bookId: number, chapter: number) => {
    stopAudio();
    setSelectedBookId(bookId);
    setSelectedChapter(chapter);
    setIsHeaderVisible(true);
    updateUrlParams(bookId, chapter, selectedTranslationId);
  };

  const handleSetTranslation = (id: number | null) => {
    const targetId = id ?? getDefaultTranslationId(locale);
    if (id !== null) {
      saveTranslationPreference(id, locale);
    }
    setSelectedTranslationId(targetId);
    updateUrlParams(selectedBookId, selectedChapter, targetId);
  };

  const nextChapter = () => {
    if (!selectedBook) return;
    const totalChapters = getChaptersForBookId(selectedBookId);
    if (selectedChapter < totalChapters) {
      setPassage(selectedBookId, selectedChapter + 1);
    } else {
      // Siguiente libro
      const currentIdx = books.findIndex((b) => b.id === selectedBookId);
      if (currentIdx >= 0 && currentIdx < books.length - 1) {
        const nextBook = books[currentIdx + 1];
        setPassage(nextBook.id, 1);
      }
    }
  };

  const prevChapter = () => {
    if (!selectedBook) return;
    if (selectedChapter > 1) {
      setPassage(selectedBookId, selectedChapter - 1);
    } else {
      // Libro anterior
      const currentIdx = books.findIndex((b) => b.id === selectedBookId);
      if (currentIdx > 0) {
        const prevBook = books[currentIdx - 1];
        const prevBookTotal = getChaptersForBookId(prevBook.id);
        setPassage(prevBook.id, prevBookTotal || 1);
      }
    }
  };

  // Atajos de Teclado Profesionales para Navegación y Control de Paneles
  useKartexKeybindings({
    onToggleLeftSidebar: toggleLeftSidebar,
    onToggleRightInspector: toggleRightInspector,
    onPrevChapter: prevChapter,
    onNextChapter: nextChapter,
    onCloseInspector: closeInspector,
  });

  // Estado agnóstico para paneles laterales de UI (desacoplamiento FSD)
  const sidePanelValue: StudySidePanelContextValue = useMemo(() => ({
    left: {
      isOpen: isLeftSidebarOpen,
      onClose: toggleLeftSidebar,
      width: leftSidebarWidth,
      onResize: setLeftSidebarWidth,
      onReset: resetLeftSidebarWidth,
      isHeaderVisible,
    },
    right: {
      isOpen: isRightInspectorOpen,
      onClose: toggleRightInspector,
      width: rightInspectorWidth,
      onResize: setRightInspectorWidth,
      onReset: resetRightInspectorWidth,
      isHeaderVisible,
    },
  }), [
    isLeftSidebarOpen,
    toggleLeftSidebar,
    leftSidebarWidth,
    setLeftSidebarWidth,
    resetLeftSidebarWidth,
    isRightInspectorOpen,
    toggleRightInspector,
    rightInspectorWidth,
    setRightInspectorWidth,
    resetRightInspectorWidth,
    isHeaderVisible,
  ]);

  return (
    <KartexPassageContext.Provider
      value={{
        books,
        translations,
        selectedBookId,
        selectedChapter,
        selectedTranslationId,
        selectedBook,
        activeTranslation,
        setPassage,
        setSelectedTranslationId: handleSetTranslation,
        nextChapter,
        prevChapter,

        // Control de visibilidad del Header Superior sincronizado con el scroll
        isHeaderVisible,
        setIsHeaderVisible,

        // Paneles laterales del Workspace Studio
        isLeftSidebarOpen,
        toggleLeftSidebar,
        setLeftSidebarOpen,
        leftSidebarWidth,
        setLeftSidebarWidth,
        resetLeftSidebarWidth,
        isRightInspectorOpen,
        toggleRightInspector,
        setRightInspectorOpen,
        rightInspectorWidth,
        setRightInspectorWidth,
        resetRightInspectorWidth,
        activeInspectorTab,
        setActiveInspectorTab,
        inspectedWord,
        inspectedVerse,
        setInspectedVerse,
        openInspectorWithWord,
        openInspectorWithVerse,
        clearInspectedVerse,
        closeInspector,

        // Reproductor de Audio Bíblico Nativo
        isPlayingAudio,
        isAudioPaused,
        currentAudioVerse,
        audioSpeed,
        setAudioSpeed,
        sleepTimerMinutes,
        sleepTimerRemainingSeconds,
        setSleepTimer,
        availableVoices,
        selectedVoiceURI,
        setSelectedVoiceURI,
        playNextVerse,
        playPrevVerse,
        pauseAudio,
        resumeAudio,
        toggleAudio,
        stopAudio,
      }}
    >
      <StudySidePanelContextProvider value={sidePanelValue}>
        {children}
      </StudySidePanelContextProvider>
    </KartexPassageContext.Provider>
  );
};

export const useKartexPassage = () => {
  const context = useContext(KartexPassageContext);
  if (!context) {
    throw new Error('useKartexPassage debe usarse dentro de un KartexPassageProvider');
  }
  return context;
};

export const useKartexPassageSafe = () => {
  return useContext(KartexPassageContext);
};
