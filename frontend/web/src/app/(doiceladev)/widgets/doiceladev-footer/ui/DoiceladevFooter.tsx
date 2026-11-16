'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function DoiceladevFooter() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full mt-auto border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-100/80 dark:bg-[#070b12] backdrop-blur-md">
      <div className="w-full max-w-[1490px] 2xl:max-w-[1620px] mx-auto px-6 sm:px-6 lg:px-8 py-11 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 flex flex-col justify-between space-y-6 md:space-y-0 max-w-md">
            <div className="space-y-3">
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">DoicelaDev</p>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                {t('platformDesc')}
              </p>
            </div>
            <p className="text-xs text-zinc-500 font-light pt-4">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
          </div>

          <div className="md:col-span-1 space-y-3">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">{t('contents')}</p>
            <ul className="space-y-2.5 text-xs text-zinc-500 font-light">
              <li><Link href="/news" className="hover:text-cyan-400 transition-colors">{t('techNews')}</Link></li>
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">{t('archEssays')}</Link></li>
              <li><Link href="/tutorials" className="hover:text-slate-300 transition-colors">{t('handsOnTutorials')}</Link></li>
              <li><Link href="/infrastructure" className="hover:text-blue-400 transition-colors">{t('cloudInfra')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1 space-y-3 md:justify-self-end">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">{t('specialties')}</p>
            <ul className="space-y-2.5 text-xs text-zinc-500 font-light">
              <li><Link href="/ai" className="hover:text-blue-400 transition-colors">{t('aiDirectory')}</Link></li>
              <li><Link href="/cybersecurity" className="hover:text-rose-400 transition-colors">{t('secAdvisories')}</Link></li>
              <li><Link href="/projects" className="hover:text-blue-400 transition-colors">{t('projectsShowcase')}</Link></li>
              <li><Link href="/forum" className="hover:text-blue-400 transition-colors">{t('communityForums')}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

