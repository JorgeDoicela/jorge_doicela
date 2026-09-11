'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function SoftwareFooter() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full mt-auto border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-100/80 dark:bg-[#070b12] backdrop-blur-md">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-black/5 dark:border-white/5">
          <div className="md:col-span-1 space-y-2.5">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">Software</p>
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              {t('platformDesc')}
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">{t('contents')}</p>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><Link href="/software/news" className="hover:text-cyan-400 transition-colors">{t('techNews')}</Link></li>
              <li><Link href="/software/blog" className="hover:text-blue-400 transition-colors">{t('archEssays')}</Link></li>
              <li><Link href="/software/tutorials" className="hover:text-slate-300 transition-colors">{t('handsOnTutorials')}</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">{t('specialties')}</p>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><Link href="/software/ai" className="hover:text-blue-400 transition-colors">{t('aiDirectory')}</Link></li>
              <li><Link href="/software/cybersecurity" className="hover:text-rose-400 transition-colors">{t('secAdvisories')}</Link></li>
              <li><Link href="/software/forum" className="hover:text-blue-400 transition-colors">{t('communityForums')}</Link></li>
              <li><Link href="/software/projects" className="hover:text-blue-400 transition-colors">{t('projectsShowcase')}</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">{t('platforms')}</p>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><a href="https://jorgedoicela.com" className="hover:text-zinc-300 transition-colors">{t('mainPortal')}</a></li>
              <li><a href="https://portfolio.jorgedoicela.com" className="hover:text-zinc-300 transition-colors">{t('portfolioSSH')}</a></li>
              <li><a href="https://bible.jorgedoicela.com" className="hover:text-zinc-300 transition-colors">{t('exegesisBible')}</a></li>
              <li><a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors font-mono">llms.txt</a></li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior: Copyright + Redes Sociales (Idéntico a MalwareTech) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-3 text-zinc-400">
            <a
              href="https://www.linkedin.com/in/jorgedoicela/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200 p-1"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a
              href="https://github.com/JorgeDoicela"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200 p-1"
              title="GitHub"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors duration-200 p-1"
              title="X (Twitter)"
              aria-label="X (Twitter)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors duration-200 p-1"
              title="Instagram"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors duration-200 p-1"
              title="Facebook"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@jorge.doicela"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200 p-1"
              title="YouTube"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@jorge.doicela"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200 p-1"
              title="TikTok"
              aria-label="TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.28 6.34 6.34 0 0 0 9.34 21.6c3.5 0 6.34-2.84 6.34-6.33V8.86c1.33.95 2.94 1.5 4.68 1.55v-3.48c-.26-.01-.52-.09-.77-.24z" />
              </svg>
            </a>
            <a
              href="mailto:jorge.doicela.m@gmail.com"
              className="hover:text-white transition-colors duration-200 p-1"
              title="Email"
              aria-label="Email"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
