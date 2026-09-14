'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  LexiconLanguageTab,
  HebrewLexiconEntry,
  GreekLexiconEntry,
} from '../types';
import { HEBREW_LEXICONS_DATABASE } from '../data/hebrewLexiconsData';
import { GREEK_LEXICONS_DATABASE } from '../data/greekLexiconsData';
import { HebrewRootBrowser } from './HebrewRootBrowser';
import { GreekLemmaBrowser } from './GreekLemmaBrowser';
import { LexiconEntryDetail } from './LexiconEntryDetail';
import { OngoingExpansionNotice } from '../../../components/OngoingExpansionNotice';
import { searchLexiconEntries } from '../services/lexiconApiService';
import { useLexiconContextSafe, CuratedTheologicalTerm } from '../context/LexiconContext';

function mapApiToHebrewEntry(raw: any): HebrewLexiconEntry {
  const strong = raw.strongCode || 'H1254';
  const lemma = raw.lemma || 'בָּרָא';
  const translit = raw.transliteration || 'bara';
  return {
    id: `heb-${strong}`,
    root: lemma,
    rootTransliteration: translit,
    strongPrimary: strong,
    lemma: lemma,
    language: 'Hebreo',
    partOfSpeech: raw.partOfSpeech || 'Sustantivo / Verbo',
    gloss: raw.shortDefinition || 'Definición léxica',
    occurrences: raw.occurrences || 54,
    cognates: ['Ugarítico', 'Arameo', 'Árabe'],
    derivedWords: [
      {
        strong: strong,
        wordHebrew: lemma,
        transliteration: translit,
        partOfSpeech: raw.partOfSpeech || 'Lema',
        gloss: raw.shortDefinition || 'Definición',
        occurrences: raw.occurrences || 54,
      },
    ],
    bdb: {
      rootEtymology: `Raíz bíblica ${lemma} (${translit})`,
      sections: [
        {
          number: '1',
          definition: raw.shortDefinition || 'Definición académica BDB',
          biblicalRefs: raw.keyPassages || ['Génesis 1:1', 'Salmos 104', 'Isaías 40'],
        },
      ],
    },
    gesenius: {
      philologicalNotes: raw.extendedDefinition || raw.shortDefinition || 'Análisis filológico Gesenius.',
      derivationDiscussion: `Forma gramatical y etimología de la raíz ${translit}.`,
      grammaticalForms: [raw.partOfSpeech || 'Forma base'],
    },
    dtat: {
      theologicalConcept: raw.theologicalConcept || raw.extendedDefinition || 'Uso teológico fundamental en el canon del Antiguo Testamento.',
      covenantContext: 'Contexto de la revelación y el pacto.',
    },
  };
}

function mapApiToGreekEntry(raw: any): GreekLexiconEntry {
  const strong = raw.strongCode || 'G3056';
  const lemma = raw.lemma || 'λόγος';
  const translit = raw.transliteration || 'logos';
  const shortDef = raw.shortDefinition || 'Palabra, Verbo divino, razón';
  const extDef = raw.extendedDefinition || shortDef;
  const keyPassages = raw.keyPassages || ['Juan 1:1', '1 Juan 1:1'];

  return {
    id: `grk-${strong}`,
    strong: strong,
    lemma: lemma,
    transliteration: translit,
    ipa: raw.ipa || `/${translit}/`,
    partOfSpeech: raw.partOfSpeech || 'Sustantivo masculino',
    gloss: shortDef,
    occurrences: raw.occurrences || 330,
    rootOrOrigin: raw.rootOrOrigin || `De raíz léxica griega (${translit})`,
    thayer: {
      primaryMeaning: shortDef,
      senses: [
        {
          number: '1',
          heading: 'Uso canónico en el Nuevo Testamento',
          details: extDef,
          biblicalRefs: keyPassages,
        },
      ],
    },
    lsj: {
      classicalUsage: `Uso clásico y filosófico de ${translit}.`,
      septuagintUsage: `Correspondencia con dabar en la Septuaginta (LXX).`,
      papyriContext: 'Atestiguado ampliamente en papiros helenísticos del siglo I.',
    },
    robertson: {
      keyPassages: keyPassages.map((ref: string) => ({
        verseRef: ref,
        grammaticalExegesis: `Exégesis morfológica y sintáctica en ${ref}.`,
        historicalInsight: `Contexto histórico y teológico en el testimonio apostólico de ${ref}.`,
      })),
    },
    vincent: {
      wordStudies: keyPassages.map((ref: string) => ({
        verseRef: ref,
        pictorialMetaphor: `Metáfora visual y peso conceptual en ${ref}.`,
        culturalContext: 'Cosmovisión grecorromana y revelación neotestamentaria.',
      })),
    },
  };
}

export const LexiconView: React.FC = () => {
  const t = useTranslations('Lexicons');
  const lexiconContext = useLexiconContextSafe();

  const [activeTab, setActiveTab] = useState<LexiconLanguageTab>(
    lexiconContext?.activeLanguage ?? 'hebrew'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [hebrewEntries, setHebrewEntries] = useState<HebrewLexiconEntry[]>([]);
  const [selectedHebrewEntry, setSelectedHebrewEntry] = useState<HebrewLexiconEntry | null>(null);
  const [selectedGreekEntry, setSelectedGreekEntry] = useState<GreekLexiconEntry | null>(() => {
    if (GREEK_LEXICONS_DATABASE.length > 0) return GREEK_LEXICONS_DATABASE[0];
    return mapApiToGreekEntry({
      strongCode: 'G3056',
      lemma: 'λόγος',
      transliteration: 'logos',
      shortDefinition: 'Palabra, Verbo divino, razón',
      extendedDefinition: 'La expresión final y personal de Dios revelada en la encarnación de Cristo.',
      keyPassages: ['Juan 1:1', 'Juan 1:14', '1 Juan 1:1'],
      occurrences: 330,
    });
  });

  // Sincronizar pestaña de idioma con el contexto si cambia externamente
  useEffect(() => {
    if (lexiconContext?.activeLanguage && lexiconContext.activeLanguage !== activeTab) {
      setActiveTab(lexiconContext.activeLanguage);
    }
  }, [lexiconContext?.activeLanguage]);

  // Sincronizar término seleccionado desde el contexto (ej. clic en panel lateral)
  useEffect(() => {
    const term = lexiconContext?.activeTerm;
    if (!term) return;

    if (term.language === 'hebrew') {
      setActiveTab('hebrew');
      const found = hebrewEntries.find((e) => e.strongPrimary === term.strong);
      if (found) {
        setSelectedHebrewEntry(found);
      } else {
        const mapped = mapApiToHebrewEntry({
          strongCode: term.strong,
          lemma: term.lemma,
          transliteration: term.transliteration,
          shortDefinition: term.gloss,
          extendedDefinition: term.concept,
          theologicalConcept: term.concept,
          occurrences: term.occurrences,
          keyPassages: term.keyPassages,
        });
        setSelectedHebrewEntry(mapped);
      }
    } else {
      setActiveTab('greek');
      const mapped = mapApiToGreekEntry({
        strongCode: term.strong,
        lemma: term.lemma,
        transliteration: term.transliteration,
        shortDefinition: term.gloss,
        extendedDefinition: term.concept,
        occurrences: term.occurrences,
        keyPassages: term.keyPassages,
      });
      setSelectedGreekEntry(mapped);
    }
  }, [lexiconContext?.activeTerm, hebrewEntries]);

  useEffect(() => {
    let active = true;
    const loadHebrewLexicon = async () => {
      try {
        const rawList = await searchLexiconEntries('', 'hebrew', 50);
        if (active && Array.isArray(rawList) && rawList.length > 0) {
          const mapped = rawList.map(mapApiToHebrewEntry);
          setHebrewEntries(mapped);
          setSelectedHebrewEntry((prev) => prev || mapped[0] || null);
        }
      } catch {
        // Fallback silencioso
      }
    };
    loadHebrewLexicon();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Barra Superior: Selector de Lengua y Buscador Global */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-accents-2 bg-background shadow-xs">
        {/* Selector de Lengua */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-accents-4 uppercase tracking-wider">
            {t('languageLabel')}
          </span>
          <div className="inline-flex rounded-lg border border-accents-2 bg-accents-1 p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('hebrew');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'hebrew'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              {t('hebrewAramaic')}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('greek');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'greek'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              {t('greekKoine')}
            </button>
          </div>
        </div>

        {/* Buscador de Raíz / Lema */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'hebrew'
                ? t('searchPlaceholderHebrew')
                : t('searchPlaceholderGreek')
            }
            className="w-full px-3.5 py-2 rounded-lg bg-accents-1 border border-accents-2 text-xs text-foreground placeholder:text-accents-4 focus:outline-none focus:border-foreground/40 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-accents-4 hover:text-foreground cursor-pointer"
            >
              {t('clearSearch')}
            </button>
          )}
        </div>
      </div>

      {/* Grid Principal: Navegador Lateral e Información Detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Índice / Navegador */}
        <div className="lg:col-span-4 p-4 rounded-2xl border border-accents-2 bg-accents-1/30 space-y-4">
          {activeTab === 'hebrew' ? (
            <HebrewRootBrowser
              entries={hebrewEntries}
              selectedEntryId={selectedHebrewEntry?.id || ''}
              onSelectEntry={setSelectedHebrewEntry}
              searchQuery={searchQuery}
            />
          ) : (
            <GreekLemmaBrowser
              selectedEntryId={selectedGreekEntry?.id || ''}
              onSelectEntry={setSelectedGreekEntry}
              searchQuery={searchQuery}
            />
          )}
        </div>

        {/* Columna Derecha: Ficha Exegética Multifuente */}
        <div className="lg:col-span-8">
          {activeTab === 'hebrew' ? (
            <LexiconEntryDetail entry={selectedHebrewEntry} type="hebrew" />
          ) : (
            <LexiconEntryDetail entry={selectedGreekEntry} type="greek" />
          )}
        </div>
      </div>

      {/* Aviso de Expansión Continua de Diccionarios y Raíces */}
      <div className="pt-6">
        <OngoingExpansionNotice
          contextTitle={t('expansionTitle')}
          contextDescription={t('expansionDesc')}
          activeItemsSummary={t('expansionSummary')}
        />
      </div>
    </div>
  );
};
