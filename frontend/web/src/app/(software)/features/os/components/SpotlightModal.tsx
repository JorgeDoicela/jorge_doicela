'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SpotlightSearchResult } from '../types';
import { NewsArticle } from '../../news/types';
import { BlogPost } from '../../blog/types';
import { ForumTopic } from '../../forum/types';
import { AiResource } from '../../ai/types';
import { SecurityPost } from '../../cybersecurity/types';
import { Tutorial } from '../../tutorials/types';
import { Project } from '../../projects/types';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsArticle[];
  posts: BlogPost[];
  topics: ForumTopic[];
  aiResources: AiResource[];
  secPosts: SecurityPost[];
  tutorials: Tutorial[];
  projects: Project[];
}

export function SpotlightModal({
  isOpen,
  onClose,
  news,
  posts,
  topics,
  aiResources,
  secPosts,
  tutorials,
  projects,
}: SpotlightModalProps) {
  const t = useTranslations('Spotlight');
  const tNav = useTranslations('Nav');
  const tSearch = useTranslations('Search');
  const tCard = useTranslations('CardActions');
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Escuchar tecla escape y Cmd+K globalmente
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Autofoco al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Indexar todo el contenido de los 7 dominios
  const allSearchableItems: SpotlightSearchResult[] = useMemo(() => {
    const items: SpotlightSearchResult[] = [];

    news.forEach((n) => {
      items.push({
        id: `news-${n.id}`,
        title: n.title,
        category: 'news',
        categoryLabel: tNav('news'),
        snippet: n.excerpt,
        href: `/software/news/${n.slug}`,
        tag: n.isBreaking ? 'BREAKING' : undefined,
      });
    });

    posts.forEach((p) => {
      items.push({
        id: `blog-${p.id}`,
        title: p.title,
        category: 'blog',
        categoryLabel: tNav('blog'),
        snippet: p.excerpt,
        href: `/software/blog/${p.slug}`,
      });
    });

    aiResources.forEach((a) => {
      items.push({
        id: `ai-${a.id}`,
        title: a.name,
        category: 'ai',
        categoryLabel: tNav('ai'),
        snippet: a.description,
        href: `/software/ai/${a.slug}`,
        tag: a.type.toUpperCase(),
      });
    });

    secPosts.forEach((s) => {
      items.push({
        id: `sec-${s.id}`,
        title: s.title,
        category: 'cybersecurity',
        categoryLabel: tNav('cybersecurity'),
        snippet: s.excerpt,
        href: `/software/cybersecurity/${s.slug}`,
        tag: s.severity.toUpperCase(),
      });
    });

    tutorials.forEach((t) => {
      items.push({
        id: `tut-${t.id}`,
        title: t.title,
        category: 'tutorials',
        categoryLabel: tNav('tutorials'),
        snippet: t.description,
        href: `/software/tutorials/${t.slug}`,
        tag: t.difficulty.toUpperCase(),
      });
    });

    topics.forEach((top) => {
      items.push({
        id: `forum-${top.id}`,
        title: top.title,
        category: 'forum',
        categoryLabel: tNav('forum'),
        snippet: top.content.slice(0, 100) + '...',
        href: `/software/forum/${top.slug}`,
        tag: tCard('repliesCount', { count: top.repliesCount }),
      });
    });

    projects.forEach((prj) => {
      items.push({
        id: `prj-${prj.id}`,
        title: prj.name,
        category: 'projects',
        categoryLabel: tNav('projects'),
        snippet: prj.description,
        href: `/software/projects/${prj.slug}`,
        tag: prj.status.toUpperCase(),
      });
    });

    return items;
  }, [news, posts, topics, aiResources, secPosts, tutorials, projects]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return allSearchableItems.slice(0, 8); // Mostrar sugerencias iniciales
    }
    const cleanQuery = query.toLowerCase();
    return allSearchableItems.filter(
      (item) =>
        item.title.toLowerCase().includes(cleanQuery) ||
        item.snippet.toLowerCase().includes(cleanQuery) ||
        item.categoryLabel.toLowerCase().includes(cleanQuery)
    );
  }, [allSearchableItems, query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-28 px-4 bg-black/60 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl glass-convex-panel overflow-hidden border border-black/10 dark:border-white/15 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de Búsqueda Input */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <span className="font-mono text-zinc-400 text-sm font-bold pl-2">⌥</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tSearch('placeholder')}
            className="w-full bg-transparent text-sm md:text-base text-[var(--foreground)] placeholder-zinc-500 outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-zinc-500 hover:text-zinc-300 font-mono px-2 py-1 rounded bg-white/5 cursor-pointer"
            >
              {t('clear')}
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded-lg glass-btn-neumorphic cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Resultados */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              {t('noResults', { query })}
            </div>
          ) : (
            filteredResults.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="group flex items-center justify-between p-3 rounded-2xl glass-concave-panel hover:bg-white/5 hover:border-white/20 transition-all block"
              >
                <div className="space-y-1 pr-4 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                      [{item.categoryLabel}]
                    </span>
                    {item.tag && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border border-white/10 text-zinc-400">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm font-bold text-[var(--header-title)] truncate group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 font-light">
                    {item.snippet}
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0">
                  {t('go')}
                </span>
              </Link>
            ))
          )}
        </div>

        {/* Footer de Ayuda */}
        <div className="px-4 py-2.5 bg-black/20 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>{t('resultsAvailable', { count: filteredResults.length })}</span>
          <span>{t('escHint')}</span>
        </div>
      </div>
    </div>
  );
}
