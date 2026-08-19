'use client';

import React, { useState, useEffect } from 'react';
import {
  HebrewAramaicToken,
  GreekToken,
  InterlinearDisplaySettings,
  InterlinearVerse,
  GreekInterlinearVerse,
  StrongLexiconEntry,
} from '../types';
import { MASORETIC_INTERLINEAR_DATA } from '../data/masoreticData';
import { GREEK_INTERLINEAR_DATA } from '../data/greekData';
import { STRONG_LEXICON_DATABASE } from '../data/strongLexiconData';
import { InterlinearControls } from './InterlinearControls';
import { HebrewWordCard } from './HebrewWordCard';
import { GreekWordCard } from './GreekWordCard';
import { AramaicSectionBanner } from './AramaicSectionBanner';
import { MorphologyDetailModal } from './MorphologyDetailModal';
import { GreekMorphologyModal } from './GreekMorphologyModal';
import { ReverseInterlinearReader } from './ReverseInterlinearReader';
import { StrongLexiconDrawer } from './StrongLexiconDrawer';
import { OngoingExpansionNotice } from '../../../components/OngoingExpansionNotice';

interface InterlinearViewProps {
  selectedBookAbbr?: string | null;
}

export const InterlinearView: React.FC<InterlinearViewProps> = ({
  selectedBookAbbr,
}) => {
  const [activeCanon, setActiveCanon] = useState<'OT' | 'NT'>('OT');

  const [settings, setSettings] = useState<InterlinearDisplaySettings>({
    layout: 'reverse_interlinear',
    showNikkud: true,
    showTransliteration: true,
    showGloss: true,
    showStrong: true,
    showMorphologyTag: true,
    fontSize: 'xl',
    audioSpeed: 1.0,
  });

  // Estado interactivo de hover sincronizado
  const [hoveredTokenId, setHoveredTokenId] = useState<string | null>(null);

  // Modales de parsing morfológico
  const [selectedHebrewToken, setSelectedHebrewToken] =
    useState<HebrewAramaicToken | null>(null);
  const [hebrewModalOpen, setHebrewModalOpen] = useState(false);

  const [selectedGreekToken, setSelectedGreekToken] = useState<GreekToken | null>(
    null,
  );
  const [greekModalOpen, setGreekModalOpen] = useState(false);

  // Modal / Drawer de Léxico Strong
  const [selectedStrongEntry, setSelectedStrongEntry] =
    useState<StrongLexiconEntry | null>(null);
  const [strongDrawerOpen, setStrongDrawerOpen] = useState(false);

  const handleOpenStrong = (strongCode: string) => {
    const entry = STRONG_LEXICON_DATABASE[strongCode];
    if (entry) {
      setSelectedStrongEntry(entry);
      setStrongDrawerOpen(true);
    } else {
      // Entrada sintética de respaldo si no está precalculada
      setSelectedStrongEntry({
        strong: strongCode,
        language: strongCode.startsWith('H') ? 'Hebrew' : 'Greek',
        lemma: strongCode.startsWith('H') ? 'שָׁרָשׁ' : 'λόγος',
        transliteration: strongCode,
        ipa: `/${strongCode}/`,
        pronunciationGuide: strongCode,
        partOfSpeech: 'Entrada Léxica',
        shortDefinition: `Código de Concordancia Strong ${strongCode}.`,
        extendedDefinition: [
          `Entrada exegética para el código ${strongCode}.`,
        ],
      });
      setStrongDrawerOpen(true);
    }
  };

  // Sincronizar automáticamente el canon según el libro seleccionado
  useEffect(() => {
    if (selectedBookAbbr) {
      const upper = selectedBookAbbr.toUpperCase();
      if (upper === 'JN' || upper === 'ROM' || upper === 'MAT') {
        setActiveCanon('NT');
      } else if (
        upper === 'GEN' ||
        upper === 'SAL' ||
        upper === 'DAN' ||
        upper === 'JEREMIAS' ||
        upper === 'ESD'
      ) {
        setActiveCanon('OT');
      }
    }
  }, [selectedBookAbbr]);

  // Versículos en Hebreo / Arameo
  const displayHebrewVerses: InterlinearVerse[] = React.useMemo(() => {
    if (!selectedBookAbbr) return MASORETIC_INTERLINEAR_DATA;
    const filtered = MASORETIC_INTERLINEAR_DATA.filter(
      (v) => v.bookAbbreviation.toUpperCase() === selectedBookAbbr.toUpperCase(),
    );
    return filtered.length > 0 ? filtered : MASORETIC_INTERLINEAR_DATA;
  }, [selectedBookAbbr]);

  // Versículos en Griego Koiné
  const displayGreekVerses: GreekInterlinearVerse[] = React.useMemo(() => {
    if (!selectedBookAbbr) return GREEK_INTERLINEAR_DATA;
    const filtered = GREEK_INTERLINEAR_DATA.filter(
      (v) => v.bookAbbreviation.toUpperCase() === selectedBookAbbr.toUpperCase(),
    );
    return filtered.length > 0 ? filtered : GREEK_INTERLINEAR_DATA;
  }, [selectedBookAbbr]);

  return (
    <div className="space-y-6">
      {/* Selector de Testamento / Lengua Original */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-accents-2 bg-accents-1/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-accents-4">Testamento Original:</span>
          <div className="inline-flex rounded-lg border border-accents-2 bg-background p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveCanon('OT')}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                activeCanon === 'OT'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              Antiguo Testamento (Hebreo / Arameo BHS)
            </button>
            <button
              type="button"
              onClick={() => setActiveCanon('NT')}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                activeCanon === 'NT'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              Nuevo Testamento (Griego NA28 / TR)
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-accents-4 hidden md:block">
          {activeCanon === 'OT'
            ? 'Texto Masorético Vocalizado'
            : 'Novum Testamentum Graece Politónico'}
        </div>
      </div>

      {/* Controles de visualización y modo */}
      <InterlinearControls
        settings={settings}
        onChangeSettings={setSettings}
      />

      {/* ========================================================================= */}
      {/* MODO 1: INTERLINEAL INVERSO E INTERACTIVO (ESPAÑOL ↔ LENGUA ORIGINAL)    */}
      {/* ========================================================================= */}
      {settings.layout === 'reverse_interlinear' && (
        <div className="space-y-8">
          {activeCanon === 'OT' &&
            displayHebrewVerses.map((verse) => (
              <ReverseInterlinearReader
                key={`${verse.bookAbbreviation}-${verse.chapter}-${verse.verseNumber}`}
                hebrewVerse={verse}
                settings={settings}
                activeTokenId={hoveredTokenId}
                onHoverToken={setHoveredTokenId}
                onSelectToken={(tok) => {
                  setSelectedHebrewToken(tok as HebrewAramaicToken);
                  setHebrewModalOpen(true);
                }}
                onOpenStrong={handleOpenStrong}
              />
            ))}

          {activeCanon === 'NT' &&
            displayGreekVerses.map((verse) => (
              <ReverseInterlinearReader
                key={`${verse.bookAbbreviation}-${verse.chapter}-${verse.verseNumber}`}
                greekVerse={verse}
                settings={settings}
                activeTokenId={hoveredTokenId}
                onHoverToken={setHoveredTokenId}
                onSelectToken={(tok) => {
                  setSelectedGreekToken(tok as GreekToken);
                  setGreekModalOpen(true);
                }}
                onOpenStrong={handleOpenStrong}
              />
            ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 2: CUADRÍCULA DE TARJETAS MORFOLÓGICAS CLÁSICAS                      */}
      {/* ========================================================================= */}
      {settings.layout === 'cards' && (
        <>
          {activeCanon === 'OT' && (
            <div className="space-y-8">
              {displayHebrewVerses.map((verse) => (
                <div
                  key={`${verse.bookAbbreviation}-${verse.chapter}-${verse.verseNumber}`}
                  className="p-5 sm:p-6 rounded-2xl border border-accents-2 bg-background space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-accents-2 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {verse.bookName} {verse.chapter}:{verse.verseNumber}
                      </span>
                      <span className="text-[11px] font-mono text-accents-4">
                        (Texto Masorético BHS / WLC)
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        verse.language === 'Aramaic'
                          ? 'text-amber-500 bg-amber-500/10 border-amber-500/30 font-bold'
                          : 'text-blue-500 bg-blue-500/10 border-blue-500/30 font-semibold'
                      }`}
                    >
                      {verse.language === 'Aramaic' ? 'Arameo Imperial' : 'Hebreo Bíblico'}
                    </span>
                  </div>

                  {verse.isAramaicSection && (
                    <AramaicSectionBanner contextNote={verse.aramaicContextNote} />
                  )}

                  {/* Cuadrícula RTL */}
                  <div
                    dir="rtl"
                    className="flex flex-wrap gap-3 items-start justify-start pt-2"
                  >
                    {verse.tokens.map((token) => (
                      <div key={token.id} dir="ltr">
                        <HebrewWordCard
                          token={token}
                          settings={settings}
                          isHighlighted={hoveredTokenId === token.id}
                          onHover={(id) => setHoveredTokenId(id)}
                          onLeave={() => setHoveredTokenId(null)}
                          onOpenStrong={handleOpenStrong}
                          onSelectToken={(tok) => {
                            setSelectedHebrewToken(tok);
                            setHebrewModalOpen(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeCanon === 'NT' && (
            <div className="space-y-8">
              {displayGreekVerses.map((verse) => (
                <div
                  key={`${verse.bookAbbreviation}-${verse.chapter}-${verse.verseNumber}`}
                  className="p-5 sm:p-6 rounded-2xl border border-accents-2 bg-background space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-accents-2 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {verse.bookName} {verse.chapter}:{verse.verseNumber}
                      </span>
                      <span className="text-[11px] font-mono text-accents-4">
                        (Novum Testamentum Graece NA28 / TR / SBLGNT)
                      </span>
                    </div>

                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-emerald-500 bg-emerald-500/10 border-emerald-500/30 font-semibold"
                    >
                      Griego Koiné Politónico
                    </span>
                  </div>

                  {/* Cuadrícula LTR */}
                  <div className="flex flex-wrap gap-3 items-start justify-start pt-2">
                    {verse.tokens.map((token) => (
                      <GreekWordCard
                        key={token.id}
                        token={token}
                        settings={settings}
                        isHighlighted={hoveredTokenId === token.id}
                        onHover={(id) => setHoveredTokenId(id)}
                        onLeave={() => setHoveredTokenId(null)}
                        onOpenStrong={handleOpenStrong}
                        onSelectToken={(tok) => {
                          setSelectedGreekToken(tok);
                          setGreekModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modales de Parsing Morfológico */}
      <MorphologyDetailModal
        isOpen={hebrewModalOpen}
        onClose={() => setHebrewModalOpen(false)}
        token={selectedHebrewToken}
      />

      <GreekMorphologyModal
        isOpen={greekModalOpen}
        onClose={() => setGreekModalOpen(false)}
        token={selectedGreekToken}
      />

      {/* Modal / Drawer de Léxico y Diccionario Strong */}
      <StrongLexiconDrawer
        isOpen={strongDrawerOpen}
        onClose={() => setStrongDrawerOpen(false)}
        entry={selectedStrongEntry}
        audioSpeed={settings.audioSpeed}
      />

      {/* Aviso de Expansión Continua de Manuscritos Interlineales */}
      <div className="pt-6">
        <OngoingExpansionNotice
          contextTitle="Módulo Interlineal en Crecimiento"
          contextDescription="Esta plataforma es nueva y por eso aún no cuenta con muchas cosas. Me esfuerzo cada día por brindarte un trabajo riguroso y de máxima calidad, indexando y lematizando morfológicamente cada término hebreo, arameo y griego palabra por palabra junto con su pronunciación y concordancia Strong."
          activeItemsSummary="Capítulos activos listos: Génesis 1, 2 y Juan 1 (BHS / NA28 / SBLGNT) con morfología completa."
        />
      </div>
    </div>
  );
};

