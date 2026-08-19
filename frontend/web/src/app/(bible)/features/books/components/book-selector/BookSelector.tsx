'use client';

import React, { useState } from 'react';
import { useBooks } from '../../hooks/useBooks';
import { CANONICAL_CATEGORIES } from '../../data/canonicCategories';

interface BookSelectorProps {
  selectedBookId: number | null;
  onSelectBook: (id: number | null) => void;
}

type TabType = 'ALL' | 'OT' | 'NT';

export function BookSelector({ selectedBookId, onSelectBook }: BookSelectorProps) {
  const { books, loading, error } = useBooks();
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 border-b border-accents-2 pb-2">
          <div className="h-4 w-12 bg-accents-1 animate-pulse rounded" />
          <div className="h-4 w-28 bg-accents-1 animate-pulse rounded" />
          <div className="h-4 w-28 bg-accents-1 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-8 bg-accents-1 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-xs font-mono">Error: {error}</div>;
  }

  const filteredBooks = books.filter((book) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'OT' && book.testament === 'OT') ||
      (activeTab === 'NT' && book.testament === 'NT');

    const matchesSearch =
      searchQuery.trim() === '' ||
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const tabClass = (tab: TabType) =>
    `pb-2 text-xs font-medium cursor-pointer transition-colors duration-150 border-b-2 -mb-[1px] ${
      activeTab === tab
        ? 'border-foreground text-foreground font-semibold'
        : 'border-transparent text-accents-5 hover:text-foreground'
    }`;

  return (
    <div className="space-y-3">
      {/* Barra de control superior con tabs y búsqueda rápida */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-accents-2 pb-2">
        <div className="flex gap-4">
          <button type="button" onClick={() => setActiveTab('ALL')} className={tabClass('ALL')}>
            Todos (66)
          </button>
          <button type="button" onClick={() => setActiveTab('OT')} className={tabClass('OT')}>
            Antiguo Testamento (39)
          </button>
          <button type="button" onClick={() => setActiveTab('NT')} className={tabClass('NT')}>
            Nuevo Testamento (27)
          </button>
        </div>

        <div className="relative w-full sm:w-56">
          <input
            type="text"
            placeholder="Filtrar libro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2.5 py-1 text-xs rounded-lg border border-accents-2 bg-accents-1 text-foreground placeholder:text-accents-4 focus:outline-none focus:border-foreground"
          />
          <svg
            className="w-3.5 h-3.5 text-accents-4 absolute left-2 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Vista de Libros */}
      {searchQuery.trim() !== '' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
          {filteredBooks.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => onSelectBook(book.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left flex items-center justify-between cursor-pointer ${
                selectedBookId === book.id
                  ? 'bg-foreground text-background border-foreground font-bold shadow-xs'
                  : 'bg-background hover:bg-accents-1 border-accents-2 text-foreground'
              }`}
            >
              <span className="truncate">{book.name}</span>
              <span className="text-[10px] font-mono opacity-60 ml-1 shrink-0">{book.abbreviation}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {CANONICAL_CATEGORIES.filter((cat) => {
            if (activeTab === 'OT') return cat.testament === 'OT';
            if (activeTab === 'NT') return cat.testament === 'NT';
            return true;
          }).map((cat) => {
            const catBooks = books.filter((b) => cat.bookIds.includes(b.id));
            if (catBooks.length === 0) return null;
            return (
              <div key={cat.id} className="space-y-1.5">
                <div className="text-[10px] font-bold tracking-wider uppercase text-accents-4">
                  {cat.name}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
                  {catBooks.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => onSelectBook(book.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-left flex items-center justify-between cursor-pointer ${
                        selectedBookId === book.id
                          ? 'bg-foreground text-background border-foreground font-bold shadow-xs'
                          : 'bg-background hover:bg-accents-1 border-accents-2 text-foreground'
                      }`}
                    >
                      <span className="truncate">{book.name}</span>
                      <span className="text-[10px] font-mono opacity-60 ml-1 shrink-0">
                        {book.abbreviation}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
