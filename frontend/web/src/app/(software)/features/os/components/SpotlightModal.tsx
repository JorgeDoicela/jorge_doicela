'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
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
        categoryLabel: 'Noticias',
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
        categoryLabel: 'Blog',
        snippet: p.excerpt,
        href: `/software/blog/${p.slug}`,
        tag: p.readTimeMinutes ? `${p.readTimeMinutes} min` : undefined,
      });
    });

    aiResources.forEach((a) => {
      items.push({
        id: `ai-${a.id}`,
        title: a.name,
        category: 'ai',
        categoryLabel: 'IA & Modelos',
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
        categoryLabel: 'Ciberseguridad',
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
        categoryLabel: 'Tutoriales',
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
        categoryLabel: 'Foros',
        snippet: top.content.slice(0, 100) + '...',
        href: `/software/forum/${top.slug}`,
        tag: `${top.repliesCount} resp`,
      });
    });

    projects.forEach((prj) => {
      items.push({
        id: `prj-${prj.id}`,
        title: prj.name,
        category: 'projects',
        categoryLabel: 'Proyectos',
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
            placeholder="Escribe para buscar noticias, modelos IA, tutoriales, CVEs o código..."
            className="w-full bg-transparent text-[var(--foreground)] placeholder-zinc-500 text-sm md:text-base outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded-lg glass-concave-panel cursor-pointer"
            >
              Limpiar
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
              No se encontraron resultados para &ldquo;<span className="text-zinc-300">{query}</span>&rdquo;
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
                  Ir →
                </span>
              </Link>
            ))
          )}
        </div>

        {/* Footer de Ayuda */}
        <div className="px-4 py-2.5 bg-black/20 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>{filteredResults.length} resultados disponibles</span>
          <span>Presiona <kbd className="text-zinc-400">ESC</kbd> para salir</span>
        </div>
      </div>
    </div>
  );
}
