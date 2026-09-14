'use client';

import { LexiconView, useLexiconContextSafe } from '../../../features/lexicons';
import { BiblePassageToolbar } from '../../../components/BiblePassageToolbar';
import { useBiblePassage } from '../../../context/BiblePassageContext';

export default function WordStudyPage() {
  const { selectedBook } = useBiblePassage();
  const lexicon = useLexiconContextSafe();
  const activeLang =
    lexicon?.activeLanguage ?? (selectedBook?.testament === 'NT' ? 'greek' : 'hebrew');

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <BiblePassageToolbar
        rightBadge={
          <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            {activeLang === 'hebrew'
              ? 'Léxico Hebreo (BDB • Gesenius)'
              : 'Léxico Griego (Thayer • BDAG)'}
          </span>
        }
      />
      <LexiconView />
    </div>
  );
}
