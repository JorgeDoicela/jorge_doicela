'use client';

import { useTranslations } from 'next-intl';
import { LexiconView, useLexiconContextSafe } from '../../../features/lexicons';
import { KartexPassageToolbar } from '../../../widgets/kartex-passage-toolbar';
import { useKartexPassage } from '../../../entities/passage';

export default function WordStudyPage() {
  const tStudio = useTranslations('Studio');
  const { selectedBook } = useKartexPassage();
  const lexicon = useLexiconContextSafe();
  const activeLang =
    lexicon?.activeLanguage ?? (selectedBook?.testament === 'NT' ? 'greek' : 'hebrew');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 animate-in fade-in duration-200">
      <KartexPassageToolbar
        rightBadge={
          <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            {activeLang === 'hebrew'
              ? tStudio('hebrewLexiconBadge')
              : tStudio('greekLexiconBadge')}
          </span>
        }
      />
      <LexiconView />
    </div>
  );
}
