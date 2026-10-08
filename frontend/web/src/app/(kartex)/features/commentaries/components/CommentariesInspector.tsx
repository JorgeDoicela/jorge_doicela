'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  User,
  BookOpen,
  Calendar,
  ShieldCheck,
  Tag,
  Sparkles,
  Info,
  ScrollText,
} from 'lucide-react';
import { useCommentaries } from '../context/CommentariesContext';
import { useKartexPassageSafe } from '../../../entities/passage';
import { StudySidePanel } from '../../../shared/ui';

export const CommentariesInspector: React.FC = () => {
  const { activeAuthor, activeEntry, authors } = useCommentaries();
  const passageContext = useKartexPassageSafe();
  const tStudio = useTranslations('Studio');
  const tComm = useTranslations('Commentaries');
  const currentBook = passageContext?.selectedBook;

  // Si la entrada activa tiene un autor específico, usarlo; si no, el activo
  const author = authors.find((a) => a.id === activeEntry?.authorId) || activeAuthor;

  return (
    <StudySidePanel
      side="right"
      title={tStudio('toggleCommentariesInspector') || tComm('inspectorTitle')}
      icon={<ScrollText className="w-4 h-4 text-amber-500" />}
      storageKey="kartex_commentaries_inspector_w"
      defaultWidth={360}
      collapseTitle={tStudio('closeInspector') || 'Ocultar inspector'}
    >
      <StudySidePanel.Body className="space-y-4">
        {author ? (
          <div className="space-y-4">
            {/* Ficha del Autor y de la Obra */}
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
                  {tComm('commentator')}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  <Calendar className="w-3 h-3 text-zinc-400" />
                  {author.era}
                </span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-serif leading-snug">
                {author.author}
              </h3>
              <div className="space-y-1 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                  {tComm('canonicalWork')}
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium italic">
                  {author.historicalWork}
                </p>
              </div>
            </div>

            {/* Enfoque Hermenéutico */}
            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-1.5 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                {tComm('hermeneuticalFocus')}
              </span>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {author.theologicalFocus}
              </p>
            </div>

            {/* Perfil Biográfico */}
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                {tComm('biographicalProfile')}
              </span>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-serif">
                {author.biography}
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {author.license}
                </span>
              </div>
            </div>

            {/* Pasaje Seleccionado */}
            {activeEntry && (
              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold block">
                  {tComm('activePassage')}
                </span>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono block">
                    {currentBook?.name || activeEntry.bookId} {activeEntry.chapter}:{activeEntry.verseStart}
                    {activeEntry.verseEnd && activeEntry.verseEnd !== activeEntry.verseStart
                      ? `-${activeEntry.verseEnd}`
                      : ''}
                  </span>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-2">
                    {activeEntry.title}
                  </p>
                </div>

                {activeEntry.tags && activeEntry.tags.length > 0 && (
                  <div className="pt-2 border-t border-amber-500/15 flex flex-wrap gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    {activeEntry.tags.map((tag, idx) => (
                      <span key={idx} className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
            <ScrollText className="w-8 h-8 text-zinc-400 mx-auto" />
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {tComm('emptyInspectorTitle')}
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {tComm('emptyInspectorDesc')}
            </p>
          </div>
        )}
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};

