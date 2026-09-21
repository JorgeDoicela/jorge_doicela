'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  GitCompare,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Languages,
  Sparkles,
  ArrowRightLeft,
  BookMarked,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { useParallelContextSafe } from '../../context/ParallelContext';
import { computeWordDiff, TRANSLATION_APPROACHES } from '../../textual-diff';
import { StrongMorphologyInspector } from '../../../../widgets/exegesis-inspector';
import { ResizeBorderHandle } from '../../../../shared/ui';

export const ParallelDiffInspector: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const parallel = useParallelContextSafe();
  const tStudio = useTranslations('Studio');

  const rightInspectorWidth = passageContext?.rightInspectorWidth ?? 360;
  const setRightInspectorWidth = passageContext?.setRightInspectorWidth ?? (() => {});
  const resetRightInspectorWidth = passageContext?.resetRightInspectorWidth ?? (() => {});

  const [activeTab, setActiveTab] = useState<'diff' | 'strong'>('diff');
  const [copied, setCopied] = useState(false);

  const isOpen = passageContext?.isRightInspectorOpen ?? false;
  const handleClose = passageContext?.closeInspector ?? (() => {});

  const selectedBook = passageContext?.selectedBook;
  const selectedChapter = passageContext?.selectedChapter ?? 1;

  const columns = parallel?.columns ?? [];
  const rows = parallel?.rows ?? [];
  const selectedVerseNumber = parallel?.selectedVerseNumber ?? 1;
  const setSelectedVerseNumber = parallel?.setSelectedVerseNumber ?? (() => {});

  const selectedRow = parallel?.selectedRow;

  // Seleccionar qué 2 traducciones se están comparando en el inspector
  const diffTransAId = parallel?.diffTransAId ?? (columns[0]?.translationId ?? null);
  const diffTransBId = parallel?.diffTransBId ?? (columns[1]?.translationId ?? null);
  const setDiffTransAId = parallel?.setDiffTransAId ?? (() => {});
  const setDiffTransBId = parallel?.setDiffTransBId ?? (() => {});

  const dataA = diffTransAId != null ? selectedRow?.translations[diffTransAId] : null;
  const dataB = diffTransBId != null ? selectedRow?.translations[diffTransBId] : null;

  const textA = dataA?.text || '';
  const textB = dataB?.text || '';
  const abbrA = dataA?.translationAbbreviation || (columns[0] ? `Col 1` : 'A');
  const abbrB = dataB?.translationAbbreviation || (columns[1] ? `Col 2` : 'B');

  const approachA = TRANSLATION_APPROACHES[abbrA];
  const approachB = TRANSLATION_APPROACHES[abbrB];

  // Cálculo de Diff en tiempo real
  const diffResult = useMemo(() => {
    if (!textA || !textB) return null;
    return computeWordDiff(textA, textB);
  }, [textA, textB]);

  const handleCopyComparison = () => {
    if (!selectedRow) return;
    const content = `[${selectedBook?.name || 'Génesis'} ${selectedChapter}:${selectedVerseNumber}]\n${abbrA}: "${textA}"\n${abbrB}: "${textB}"\n(Similitud léxica: ${diffResult?.similarityPercentage ?? 0}%)`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrevVerse = () => {
    if (selectedVerseNumber > 1) {
      setSelectedVerseNumber(selectedVerseNumber - 1);
    }
  };

  const handleNextVerse = () => {
    const maxVerse = rows.length > 0 ? rows[rows.length - 1].verseNumber : 50;
    if (selectedVerseNumber < maxVerse) {
      setSelectedVerseNumber(selectedVerseNumber + 1);
    }
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
        aria-label="Inspector de Diff Textual y Variantes"
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
                <GitCompare className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />
              </div>
              <div>
                <span className="text-xs font-bold text-foreground block">
                  {selectedBook?.name || 'Génesis'} {selectedChapter}:{selectedVerseNumber}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Análisis diferencial sincronizado
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevVerse}
                disabled={selectedVerseNumber <= 1}
                className="p-1 rounded-md text-zinc-400 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30 cursor-pointer"
                title="Versículo anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextVerse}
                className="p-1 rounded-md text-zinc-400 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                title="Versículo siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="lg:hidden p-1 rounded-md text-zinc-400 hover:text-foreground"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Selector de Pestañas: Diff Textual vs Morfología Strong */}
          <div className="grid grid-cols-2 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab('diff')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'diff'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Diff Textual</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('strong')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'strong'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Morfología</span>
            </button>
          </div>
        </div>

        {/* CONTENIDO CON SCROLL */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'diff' && (
            <>
              {/* SELECTORES DE LAS DOS VERSIONES A COMPARAR */}
              <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Cotejar Columnas</span>
                  <button
                    type="button"
                    onClick={handleCopyComparison}
                    className="flex items-center gap-1 text-zinc-500 hover:text-foreground cursor-pointer transition-colors"
                    title="Copiar comparación"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Base A:</label>
                    <select
                      value={diffTransAId ?? ''}
                      onChange={(e) => setDiffTransAId(Number(e.target.value))}
                      className="w-full text-xs font-mono py-1 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-foreground cursor-pointer focus:outline-hidden"
                    >
                      {columns.map((col) => {
                        const tr = passageContext?.translations.find((t) => t.id === col.translationId);
                        return (
                          <option key={col.id} value={col.translationId}>
                            {tr?.abbreviation || `ID ${col.translationId}`}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Cotejo B:</label>
                    <select
                      value={diffTransBId ?? ''}
                      onChange={(e) => setDiffTransBId(Number(e.target.value))}
                      className="w-full text-xs font-mono py-1 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-foreground cursor-pointer focus:outline-hidden"
                    >
                      {columns.map((col) => {
                        const tr = passageContext?.translations.find((t) => t.id === col.translationId);
                        return (
                          <option key={col.id} value={col.translationId}>
                            {tr?.abbreviation || `ID ${col.translationId}`}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* MÉTRICA DE SIMILITUD */}
                {diffResult && (
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-500 dark:text-zinc-400">Similitud Léxica (LCS):</span>
                      <span className="font-bold text-foreground">
                        {diffResult.similarityPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${diffResult.similarityPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CONTRASTE TEXTUAL DETALLADO */}
              {diffResult ? (
                <div className="space-y-3">
                  {/* VERSIÓN A */}
                  <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-background space-y-2 shadow-2xs overflow-hidden max-w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-foreground">
                        {abbrA}
                      </span>
                      {approachA && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${approachA.badgeColor}`}>
                          {approachA.philosophy}
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-[13px] leading-relaxed font-serif text-zinc-800 dark:text-zinc-200 flex flex-wrap items-baseline gap-x-1 gap-y-1.5 break-words">
                      {diffResult.tokensA.map((tok, i) => {
                        if (tok.type === 'REMOVED') {
                          return (
                            <span
                              key={i}
                              className="bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium rounded-xs px-1 py-0.5 inline-block"
                              title="Palabra omitida o divergente en B"
                            >
                              {tok.value}
                            </span>
                          );
                        }
                        return (
                          <span key={i} className="py-0.5 inline-block">
                            {tok.value}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* VERSIÓN B */}
                  <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-background space-y-2 shadow-2xs overflow-hidden max-w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-foreground">
                        {abbrB}
                      </span>
                      {approachB && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${approachB.badgeColor}`}>
                          {approachB.philosophy}
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-[13px] leading-relaxed font-serif text-zinc-800 dark:text-zinc-200 flex flex-wrap items-baseline gap-x-1 gap-y-1.5 break-words">
                      {diffResult.tokensB.map((tok, i) => {
                        if (tok.type === 'ADDED') {
                          return (
                            <span
                              key={i}
                              className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium rounded-xs px-1 py-0.5 inline-block"
                              title="Palabra añadida o diferente en B"
                            >
                              {tok.value}
                            </span>
                          );
                        }
                        return (
                          <span key={i} className="py-0.5 inline-block">
                            {tok.value}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-zinc-400 space-y-2">
                  <BookMarked className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
                  <p>Selecciona dos versiones activas para ver el diff textual.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'strong' && (
            <div className="animate-in fade-in duration-150">
              <StrongMorphologyInspector word={passageContext?.inspectedWord ?? null} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
