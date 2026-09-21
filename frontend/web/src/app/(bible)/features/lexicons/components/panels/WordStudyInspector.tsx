'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  BookOpen,
  Copy,
  Check,
  Sparkles,
  BarChart3,
  Bookmark,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { useLexiconContextSafe } from '../../context/LexiconContext';
import { ParallelVerseInspector } from '../../../../widgets/exegesis-inspector';
import { StudySidePanel } from '../../../../shared/ui';

export const WordStudyInspector: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const lexicon = useLexiconContextSafe();
  const tStudio = useTranslations('Studio');

  const [activeTab, setActiveTab] = useState<'concordance' | 'verse'>('concordance');
  const [copied, setCopied] = useState(false);

  const activeTerm = lexicon?.activeTerm;

  const handleCopyTerm = () => {
    if (!activeTerm) return;
    const content = `[${activeTerm.strong}] ${activeTerm.lemma} (${activeTerm.transliteration})\nGlosa: ${activeTerm.gloss}\nConcepto: ${activeTerm.concept}\nPasajes Clave: ${activeTerm.keyPassages.join(', ')}`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <StudySidePanel
      side="right"
      title="Concordancia & Exégesis"
      icon={<BarChart3 className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />}
      badge={activeTerm ? `${activeTerm.strong} • ${activeTerm.occurrences} apariciones` : undefined}
      storageKey="bible_lexicon_inspector_w"
      defaultWidth={360}
      ariaLabel="Inspector de Concordancia y Estudio de Palabra"
      collapseTitle={tStudio('closeInspector') || 'Ocultar inspector'}
    >
      <StudySidePanel.Toolbar>
        <div className="grid grid-cols-2 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveTab('concordance')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'concordance'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Concordancia</span>
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
            <span>Versículo</span>
          </button>
        </div>
      </StudySidePanel.Toolbar>

      <StudySidePanel.Body className="p-4 space-y-4">
          {activeTab === 'concordance' && (
            <>
              {activeTerm ? (
                <div className="space-y-4">
                  {/* FICHA HERO DE LA PALABRA */}
                  <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-foreground font-bold">
                        {activeTerm.strong}
                      </span>

                      <button
                        type="button"
                        onClick={handleCopyTerm}
                        className="flex items-center gap-1 text-xs text-zinc-500 hover:text-foreground cursor-pointer transition-colors"
                        title="Copiar ficha de estudio"
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

                    <div className="text-center py-2">
                      <div
                        dir={activeTerm.language === 'hebrew' ? 'rtl' : 'ltr'}
                        className="text-4xl font-serif text-foreground font-bold"
                      >
                        {activeTerm.lemma}
                      </div>
                      <div className="text-sm font-mono text-zinc-500 dark:text-zinc-400 mt-1 italic">
                        ({activeTerm.transliteration})
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Traducción:</span>
                      <span className="font-semibold text-foreground">
                        {activeTerm.gloss}
                      </span>
                    </div>
                  </div>

                  {/* CONCEPTO TEOLÓGICO */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                      Concepto Teológico Central
                    </span>
                    <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-background text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed shadow-2xs">
                      {activeTerm.concept}
                    </div>
                  </div>

                  {/* PASAJES CLAVE */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                        Pasajes Clave en el Canon
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {activeTerm.keyPassages.length} citas
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {activeTerm.keyPassages.map((ref, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-background flex items-center justify-between text-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-900 text-[10px] font-mono font-bold text-zinc-500 flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-foreground">
                              {ref}
                            </span>
                          </div>

                          <Bookmark className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-zinc-400 space-y-2">
                  <BarChart3 className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
                  <p>Selecciona un vocablo en el panel izquierdo para ver su concordancia exegética.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'verse' && (
            <div className="animate-in fade-in duration-150">
              <ParallelVerseInspector verse={passageContext?.inspectedVerse ?? null} />
            </div>
          )}
        </StudySidePanel.Body>
    </StudySidePanel>
  );
};
