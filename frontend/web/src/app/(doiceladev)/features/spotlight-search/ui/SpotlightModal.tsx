'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, X, ArrowRight } from 'lucide-react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import { SpotlightSearchResult } from '../../../shared/types/spotlight';
import { NewsArticle } from '../../../entities/news';
import { BlogPost } from '../../../entities/blog';
import { ForumTopic } from '../../../entities/forum';
import { AiResource } from '../../../entities/ai';
import { SecurityPost } from '../../../entities/cybersecurity';
import { Tutorial } from '../../../entities/tutorials';
import { Project } from '../../../entities/projects';
import { InfrastructurePost } from '../../../entities/infrastructure';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  news: NewsArticle[];
  posts: BlogPost[];
  topics: ForumTopic[];
  aiResources: AiResource[];
  secPosts: SecurityPost[];
  tutorials: Tutorial[];
  projects: Project[];
  infraPosts?: InfrastructurePost[];
}

interface SearchResultEntry {
  item: SpotlightSearchResult;
  titleMatches?: readonly [number, number][];
  snippetMatches?: readonly [number, number][];
  matchedTag?: string;
}

interface HighlightedTextProps {
  text: string;
  indices?: readonly [number, number][];
  className?: string;
  highlightClassName?: string;
}

/**
 * Renderizador de texto con resaltado de coincidencias seguro (Zero XSS).
 * Somete los intervalos a fusión defensiva para prevenir fragmentación de etiquetas.
 */
function HighlightedText({
  text,
  indices,
  className = '',
  highlightClassName = 'text-blue-600 dark:text-cyan-400 font-bold',
}: HighlightedTextProps) {
  if (!text) return null;
  if (!indices || indices.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const sorted = [...indices].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of sorted) {
    if (merged.length === 0) {
      merged.push([start, end]);
    } else {
      const last = merged[merged.length - 1];
      if (start <= last[1] + 1) {
        last[1] = Math.max(last[1], end);
      } else {
        merged.push([start, end]);
      }
    }
  }

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  merged.forEach(([start, end], idx) => {
    const validStart = Math.max(0, Math.min(start, text.length));
    const validEnd = Math.max(0, Math.min(end + 1, text.length));

    if (validStart > cursor) {
      nodes.push(text.slice(cursor, validStart));
    }
    if (validEnd > validStart) {
      nodes.push(
        <mark
          key={`m-${idx}-${validStart}`}
          className={`bg-transparent p-0 ${highlightClassName}`}
        >
          {text.slice(validStart, validEnd)}
        </mark>
      );
    }
    cursor = validEnd;
  });

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return <span className={className}>{nodes}</span>;
}

export function SpotlightModal({
  isOpen,
  onClose,
  initialQuery = '',
  news,
  posts,
  topics,
  aiResources,
  secPosts,
  tutorials,
  projects,
  infraPosts = [],
}: SpotlightModalProps) {
  const t = useTranslations('Spotlight');
  const tNav = useTranslations('Nav');
  const tSearch = useTranslations('Search');
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sincronización atómica síncrona en el ciclo de render (eliminando el parpadeo de useEffect)
  if (initialQuery !== prevInitialQuery) {
    setPrevInitialQuery(initialQuery);
    setQuery(initialQuery);
    setSelectedIndex(0);
  }

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

  // Bloquear scroll de la página de fondo (body y documentElement) cuando el buscador esté abierto
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  // Autofoco al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        if (initialQuery) {
          inputRef.current?.select();
        }
      }, 50);
    }
  }, [isOpen, initialQuery]);

  // Helper defensivo para parsear etiquetas CSV o arrays
  const parseTags = (raw?: string | string[]): string[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
    }
    if (typeof raw === 'string') {
      return raw
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }
    return [];
  };

  // Indexar todo el catálogo de los 8 dominios con metadatos contextuales ampliados
  const allSearchableItems: SpotlightSearchResult[] = useMemo(() => {
    const items: SpotlightSearchResult[] = [];

    news.forEach((n) => {
      items.push({
        id: `news-${n.id}`,
        title: n.title,
        category: 'news',
        categoryLabel: tNav('news'),
        snippet: n.excerpt,
        href: `/news/${n.slug}`,
        tags: parseTags(n.tags),
        extraSearchTerms: [n.author, n.category].filter(Boolean).join(' '),
      });
    });

    posts.forEach((p) => {
      items.push({
        id: `blog-${p.id}`,
        title: p.title,
        category: 'blog',
        categoryLabel: tNav('blog'),
        snippet: p.excerpt,
        href: `/blog/${p.slug}`,
        tags: parseTags(p.tags),
        extraSearchTerms: [p.author, p.category].filter(Boolean).join(' '),
      });
    });

    aiResources.forEach((a) => {
      items.push({
        id: `ai-${a.id}`,
        title: a.name,
        category: 'ai',
        categoryLabel: tNav('ai'),
        snippet: a.description,
        href: `/ai/${a.slug}`,
        tags: parseTags(a.tags),
        extraSearchTerms: [a.provider, a.category, a.license].filter(Boolean).join(' '),
      });
    });

    secPosts.forEach((s) => {
      items.push({
        id: `sec-${s.id}`,
        title: s.title,
        category: 'cybersecurity',
        categoryLabel: tNav('cybersecurity'),
        snippet: s.excerpt,
        href: `/cybersecurity/${s.slug}`,
        tags: parseTags(s.tags),
        extraSearchTerms: [s.cveId, s.affectedSystems, s.severity, s.category].filter(Boolean).join(' '),
      });
    });

    tutorials.forEach((t) => {
      items.push({
        id: `tut-${t.id}`,
        title: t.title,
        category: 'tutorials',
        categoryLabel: tNav('tutorials'),
        snippet: t.description || t.excerpt,
        href: `/tutorials/${t.slug}`,
        tags: parseTags(t.tags),
        extraSearchTerms: [t.difficulty, t.category, t.techStack, t.prerequisites].filter(Boolean).join(' '),
      });
    });

    topics.forEach((top) => {
      items.push({
        id: `forum-${top.id}`,
        title: top.title,
        category: 'forum',
        categoryLabel: tNav('forum'),
        snippet: top.content.slice(0, 100) + '...',
        href: `/forum/${top.slug}`,
        tags: parseTags(top.category),
        extraSearchTerms: [top.author, top.category].filter(Boolean).join(' '),
      });
    });

    projects.forEach((prj) => {
      items.push({
        id: `prj-${prj.id}`,
        title: prj.name,
        category: 'projects',
        categoryLabel: tNav('projects'),
        snippet: prj.description,
        href: `/projects/${prj.slug}`,
        tags: parseTags(prj.techStack),
        extraSearchTerms: [prj.category, prj.techStack, prj.status].filter(Boolean).join(' '),
      });
    });

    infraPosts.forEach((inf) => {
      items.push({
        id: `infra-${inf.id}`,
        title: inf.title,
        category: 'infrastructure',
        categoryLabel: tNav('infrastructure'),
        snippet: inf.subtitle || inf.architectureOverview || inf.contentMarkdown.slice(0, 100),
        href: `/infrastructure/${inf.slug}`,
        tags: parseTags(inf.tags),
        extraSearchTerms: [inf.environment, inf.category, inf.architectureOverview].filter(Boolean).join(' '),
      });
    });

    return items;
  }, [news, posts, topics, aiResources, secPosts, tutorials, projects, infraPosts, tNav]);

  // Configuración del motor de búsqueda difusa (Fuse.js)
  const fuseOptions = useMemo<IFuseOptions<SpotlightSearchResult>>(() => ({
    keys: [
      { name: 'title', weight: 2.5 },
      { name: 'tags', weight: 1.8 },
      { name: 'categoryLabel', weight: 1.2 },
      { name: 'extraSearchTerms', weight: 1.0 },
      { name: 'snippet', weight: 0.8 },
    ],
    threshold: 0.35,
    distance: 100,
    ignoreLocation: true,
    minMatchCharLength: 1,
    includeMatches: true,
    includeScore: true,
    shouldSort: true,
  }), []);

  const fuse = useMemo(() => new Fuse(allSearchableItems, fuseOptions), [allSearchableItems, fuseOptions]);

  // Resultados calculados con ranking de relevancia y extracción de rangos de coincidencia
  const filteredResults: SearchResultEntry[] = useMemo(() => {
    const raw = query.trim();
    if (!raw) {
      return allSearchableItems.slice(0, 8).map((item) => ({ item }));
    }

    const cleanQuery = raw.startsWith('#') ? raw.slice(1).trim() : raw;
    if (!cleanQuery) {
      return allSearchableItems.slice(0, 8).map((item) => ({ item }));
    }

    const searchResults = fuse.search(cleanQuery);
    return searchResults.slice(0, 12).map((res) => {
      const titleMatch = res.matches?.find((m) => m.key === 'title');
      const snippetMatch = res.matches?.find((m) => m.key === 'snippet');
      const tagMatch = res.matches?.find((m) => m.key === 'tags');
      const cleanLower = cleanQuery.toLowerCase();
      const matchedTag = tagMatch?.value || res.item.tags?.find((t) => t.includes(cleanLower));

      return {
        item: res.item,
        titleMatches: titleMatch?.indices,
        snippetMatches: snippetMatch?.indices,
        matchedTag,
      };
    });
  }, [allSearchableItems, fuse, query]);

  // Navegación por teclado dentro del input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, Math.max(filteredResults.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredResults[selectedIndex];
      if (current) {
        router.push(current.item.href);
        onClose();
      }
    }
  };

  // Scroll automático hacia el elemento seleccionado con flechas
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('commandPalette')}
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 bg-slate-900/40 dark:bg-black/75 backdrop-blur-md overscroll-contain transition-all duration-200"
      onClick={onClose}
    >
      {/* Contenedor Modal OPACO (Sin transparencias invasivas, acabado sólido idéntico a las tarjetas del sidebar) */}
      <div
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/15 dark:shadow-black/80 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Buscador con Superficie Sólida */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#0c121e] border-b border-slate-200/70 dark:border-white/5">
          {/* Input en Cápsula Sólida Cóncava */}
          <div className="w-full py-2.5 px-3.5 rounded-2xl bg-slate-100/90 dark:bg-[#121824] border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder={tSearch('placeholder')}
              className="w-full bg-transparent text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 outline-none font-mono"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedIndex(0);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                title={t('clear')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Lista de Resultados 100% Opaca */}
        <div ref={listRef} className="max-h-[62vh] overflow-y-auto p-3 sm:p-4 pb-4 sm:pb-5 space-y-1 bg-white dark:bg-[#0c121e] no-scrollbar overscroll-contain">
          {filteredResults.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-zinc-600 stroke-[1.5]" />
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                {t('noResults', { query })}
              </p>
            </div>
          ) : (
            filteredResults.map((entry, idx) => {
              const { item, titleMatches, snippetMatches, matchedTag } = entry;
              const isSelected = idx === selectedIndex;
              const moduleLabel = item.categoryLabel.toUpperCase();

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-start justify-between gap-3 p-3 rounded-2xl transition-all duration-150 cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-100/90 dark:bg-white/[0.08] border-slate-200/90 dark:border-white/10 shadow-xs'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Título y metadatos */}
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Metadatos en tipografía mono sobria */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                        {moduleLabel}
                      </span>
                      {matchedTag && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-semibold">
                          #{matchedTag}
                        </span>
                      )}
                    </div>

                    {/* Título con resaltado seguro de términos coincidentes */}
                    <h6
                      className={`text-xs sm:text-[13px] font-bold transition-colors line-clamp-2 leading-snug ${
                        isSelected
                          ? 'text-blue-600 dark:text-cyan-400'
                          : 'text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400'
                      }`}
                    >
                      <HighlightedText
                        text={item.title}
                        indices={titleMatches}
                        highlightClassName={
                          isSelected
                            ? 'text-blue-700 dark:text-cyan-300 font-black'
                            : 'text-blue-600 dark:text-cyan-400 font-black'
                        }
                      />
                    </h6>

                    {/* Snippet descriptivo con resaltado sutil */}
                    {item.snippet && (
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 font-light leading-relaxed">
                        <HighlightedText
                          text={item.snippet}
                          indices={snippetMatches}
                          highlightClassName="text-slate-900 dark:text-zinc-200 font-medium"
                        />
                      </p>
                    )}
                  </div>

                  {/* Flecha terminal */}
                  <ArrowRight
                    className={`w-3.5 h-3.5 mt-1 transition-all duration-150 shrink-0 ${
                      isSelected
                        ? 'text-blue-600 dark:text-cyan-400 translate-x-1'
                        : 'text-slate-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1'
                    }`}
                  />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
