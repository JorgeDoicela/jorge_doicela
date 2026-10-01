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
import { useKartexPassageSafe, ParallelVerseInspector } from '../../../../entities/passage';
import { useInterlinearContextSafe } from '../../context/InterlinearContext';
import { biblicalAudioService } from '../../services/biblicalAudioService';
import { StudySidePanel } from '../../../../shared/ui';

export const InterlinearInspector: React.FC = () => {
  const passageContext = useKartexPassageSafe();
  const interlinear = useInterlinearContextSafe();
  const tStudio = useTranslations('Studio');
  const tInter = useTranslations('Interlinear');

  const [activeTab, setActiveTab] = useState<'morphology' | 'verse'>('morphology');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

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

  return (
    <StudySidePanel
      side="right"
      title={tInter('inspectorTitle')}
      icon={<Languages className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />}
      badge={`${strongCode} • ${activeCanon === 'NT' ? 'Griego Koiné' : 'Hebreo Masorético'}`}
      storageKey="kartex_interlinear_inspector_w"
      defaultWidth={360}
      ariaLabel="Inspector de Morfología e Idiomas Originales"
      collapseTitle={tStudio('closeInspector') || 'Ocultar inspector'}
    >
      <StudySidePanel.Toolbar>
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
            <span>{tInter('morphology')}</span>
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
            <span>{tInter('versionsTab')}</span>
          </button>
        </div>
      </StudySidePanel.Toolbar>

      <StudySidePanel.Body className="p-4 space-y-5">
        {activeTab === 'morphology' && (
            <>
              {token || entry ? (
                <div className="space-y-4">
                  {/* TARJETA DE LA PALABRA HERO */}
                  <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 font-bold">
                        {strongCode}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handlePlayAudio}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-foreground hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                          title={tInter('playPronunciation')}
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
                          title={tInter('copyLemma')}
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
                      <span className="text-zinc-400">{tInter('directTranslation')}</span>
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
                        <span className="text-zinc-400">{tInter('category')}</span>
                        <span className="font-medium text-foreground">{partOfSpeech}</span>
                      </div>

                      {morphCode && (
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-400">{tInter('parsingCode')}</span>
                          <span className="font-mono font-bold text-foreground">{morphCode}</span>
                        </div>
                      )}

                      {root && (
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-400">{tInter('semiticRoot')}</span>
                          <span className="font-serif font-bold text-foreground">{root}</span>
                        </div>
                      )}

                      {isHebrew && (
                        <>
                          {token.binyan && (
                            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                              <span className="text-zinc-400">{tInter('binyanStemLabel')}</span>
                              <span className="font-medium text-foreground">{token.binyan}</span>
                            </div>
                          )}
                          {token.aspect && (
                            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                              <span className="text-zinc-400">{tInter('aspectLabel')}</span>
                              <span className="font-medium text-foreground">{token.aspect}</span>
                            </div>
                          )}
                          {token.gender && (
                            <div className="flex justify-between py-1">
                              <span className="text-zinc-400">{tInter('genderNumberLabel')}</span>
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
                              <span className="text-zinc-400">{tInter('tenseVoiceLabel')}</span>
                              <span className="font-medium text-foreground">
                                {token.tense} {token.voice ? `(${token.voice})` : ''}
                              </span>
                            </div>
                          )}
                          {token.mood && (
                            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                              <span className="text-zinc-400">{tInter('moodLabel')}</span>
                              <span className="font-medium text-foreground">{token.mood}</span>
                            </div>
                          )}
                          {token.case && (
                            <div className="flex justify-between py-1">
                              <span className="text-zinc-400">{tInter('caseGenderLabel')}</span>
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
                            <span className="text-zinc-400">{tInter('occurrencesInCanonLabel')}</span>
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
                  <p>{tInter('emptyInspectorPrompt')}</p>
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
