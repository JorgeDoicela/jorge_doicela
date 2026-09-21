'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Languages,
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  Layers,
  Copy,
  Check,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { useInterlinearContextSafe } from '../../context/InterlinearContext';
import { biblicalAudioService } from '../../services/biblicalAudioService';
import { ParallelVerseInspector } from '../../../../widgets/exegesis-inspector';
import { ResizeBorderHandle } from '../../../../shared/ui';

export const InterlinearInspector: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const interlinear = useInterlinearContextSafe();
  const tStudio = useTranslations('Studio');

  const rightInspectorWidth = passageContext?.rightInspectorWidth ?? 360;
  const setRightInspectorWidth = passageContext?.setRightInspectorWidth ?? (() => {});
  const resetRightInspectorWidth = passageContext?.resetRightInspectorWidth ?? (() => {});

  const [activeTab, setActiveTab] = useState<'morphology' | 'verse'>('morphology');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOpen = passageContext?.isRightInspectorOpen ?? false;
  const handleClose = passageContext?.closeInspector ?? (() => {});

  const token = interlinear?.selectedToken;
  const entry = interlinear?.selectedStrongEntry;
  const activeCanon = interlinear?.activeCanon ?? 'OT';

  const isHebrew = token && 'hebrew' in token;
  const isGreek = token && 'greek' in token;

  const wordText = isHebrew
    ? token.hebrew
    : isGreek
    ? token.greek
    : entry?.lemma || '—';

  const transliteration = isHebrew
    ? token.transliteration
    : isGreek
    ? token.transliteration
    : entry?.transliteration || '';

  const strongCode = token?.strong || entry?.strong || 'H0000';
  const root = isHebrew ? token.root : entry?.root;
  const partOfSpeech = isHebrew
    ? token.partOfSpeech
    : isGreek
    ? token.partOfSpeech
    : entry?.partOfSpeech || 'Léxico';

  const morphCode = isHebrew
    ? token.morphologyCode
    : isGreek
    ? token.morphologyCode
    : '';

  const handlePlayAudio = async () => {
    if (isPlayingAudio || !wordText) return;
    setIsPlayingAudio(true);
    try {
      if (isHebrew) {
        await biblicalAudioService.speakHebrewWord(wordText);
      } else if (isGreek) {
        await biblicalAudioService.speakGreekWord(wordText);
      }
    } catch {
      // Fallback
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleCopyWord = () => {
    if (!token && !entry) return;
    const content = `[${strongCode}] ${wordText} (${transliteration}) - ${entry?.shortDefinition || token?.gloss || ''}`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop en Móviles (< lg) */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />

      <aside
        aria-label="Inspector de Morfología e Idiomas Originales"
        style={{ '--inspector-w': `${rightInspectorWidth}px` } as React.CSSProperties}
        className={`fixed inset-y-0 right-0 z-50 h-screen lg:h-full lg:relative lg:z-20 w-80 sm:w-88 lg:w-[var(--inspector-w)] flex-shrink-0 border-l border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-black backdrop-blur-md flex flex-col shadow-xl lg:shadow-none overflow-hidden lg:overflow-visible print:hidden`}
      >
        {/* Tirador Redimensionable Interactivo con Arrastre y Colapso (Estilo Geist / DIITRA) */}
        <ResizeBorderHandle
          side="right"
          currentWidth={rightInspectorWidth}
          onResize={setRightInspectorWidth}
          onReset={resetRightInspectorWidth}
          onCollapse={handleClose}
          collapseTitle={tStudio('closeInspector') || 'Ocultar inspector'}
        />

        {/* Cabecera del Inspector */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-foreground">
                <Languages className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />
              </div>
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Ficha Morfológica & Léxica
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {strongCode} • {activeCanon === 'NT' ? 'Griego Koiné' : 'Hebreo Masorético'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="lg:hidden p-1 rounded-md text-zinc-400 hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* Selector de Pestañas: Morfología vs Versículo Completo */}
          <div className="grid grid-cols-2 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab('morphology')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'morphology'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Morfología</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('verse')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'verse'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Versiones</span>
            </button>
          </div>
        </div>

        {/* CONTENIDO CON SCROLL */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {activeTab === 'morphology' && (
            <>
              {token || entry ? (
                <div className="space-y-4">
                  {/* TARJETA DE LA PALABRA HERO */}
                  <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-foreground font-bold">
                        {strongCode}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handlePlayAudio}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-foreground hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                          title="Reproducir pronunciación fonética"
                        >
                          {isPlayingAudio ? (
                            <VolumeX className="w-4 h-4 text-amber-500 animate-pulse" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyWord}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-foreground hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                          title="Copiar lema y definición"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Grafía Original */}
                    <div className="text-center py-2">
                      <div
                        dir={isHebrew ? 'rtl' : 'ltr'}
                        className={`text-3xl sm:text-4xl font-serif text-foreground font-medium ${
                          isHebrew ? 'tracking-normal' : 'tracking-wide'
                        }`}
                      >
                        {wordText}
                      </div>
                      <div className="text-sm font-mono text-zinc-500 dark:text-zinc-400 mt-1 italic">
                        {transliteration}
                      </div>
                      {entry?.pronunciationGuide && (
                        <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                          "{entry.pronunciationGuide}"
                        </div>
                      )}
                    </div>

                    {/* Glosa Rápida */}
                    <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Traducción directa:</span>
                      <span className="font-semibold text-foreground">
                        {token?.gloss || entry?.shortDefinition || '—'}
                      </span>
                    </div>
                  </div>

                  {/* PARSING MORFOSINTÁCTICO */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                      Análisis Gramatical & Parsing
                    </span>

                    <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-background space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                        <span className="text-zinc-400">Categoría:</span>
                        <span className="font-medium text-foreground">{partOfSpeech}</span>
                      </div>

                      {morphCode && (
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-400">Código Parsing:</span>
                          <span className="font-mono font-bold text-foreground">{morphCode}</span>
                        </div>
                      )}

                      {root && (
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-400">Raíz Lingüística:</span>
                          <span className="font-serif font-bold text-foreground">{root}</span>
                        </div>
                      )}

                      {isHebrew && (
                        <>
                          {token.binyan && (
                            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                              <span className="text-zinc-400">Binyan (Tronco):</span>
                              <span className="font-medium text-foreground">{token.binyan}</span>
                            </div>
                          )}
                          {token.aspect && (
                            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                              <span className="text-zinc-400">Aspecto:</span>
                              <span className="font-medium text-foreground">{token.aspect}</span>
                            </div>
                          )}
                          {token.gender && (
                            <div className="flex justify-between py-1">
                              <span className="text-zinc-400">Género / Número:</span>
                              <span className="font-medium text-foreground">
                                {token.gender} {token.number ? `• ${token.number}` : ''}
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {isGreek && (
                        <>
                          {token.tense && (
                            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                              <span className="text-zinc-400">Tiempo / Voz:</span>
                              <span className="font-medium text-foreground">
                                {token.tense} {token.voice ? `(${token.voice})` : ''}
                              </span>
                            </div>
                          )}
                          {token.mood && (
                            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                              <span className="text-zinc-400">Modo:</span>
                              <span className="font-medium text-foreground">{token.mood}</span>
                            </div>
                          )}
                          {token.case && (
                            <div className="flex justify-between py-1">
                              <span className="text-zinc-400">Caso / Género:</span>
                              <span className="font-medium text-foreground">
                                {token.case} {token.gender ? `• ${token.gender}` : ''}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* DICCIONARIO & DEFINICIÓN EXEGÉTICA */}
                  {entry && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                        Definición Léxica Exegética
                      </span>

                      <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-background space-y-2.5">
                        <div>
                          <span className="text-xs font-semibold text-foreground block mb-1">
                            Significado Principal
                          </span>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                            {entry.shortDefinition}
                          </p>
                        </div>

                        {entry.extendedDefinition && entry.extendedDefinition.length > 0 && (
                          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 space-y-1">
                            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                              Acepciones en el Canon:
                            </span>
                            <ul className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400 list-disc pl-4">
                              {entry.extendedDefinition.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="leading-snug">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {entry.occurrencesInBible !== undefined && (
                          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-mono">
                            <span className="text-zinc-400">Apariciones en el canon:</span>
                            <span className="font-bold text-foreground">
                              {entry.occurrencesInBible} veces
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-zinc-400 space-y-2">
                  <Languages className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
                  <p>Haz clic en cualquier palabra del texto interlineal para ver su análisis morfológico.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'verse' && (
            <div className="animate-in fade-in duration-150">
              <ParallelVerseInspector verse={passageContext?.inspectedVerse ?? null} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
