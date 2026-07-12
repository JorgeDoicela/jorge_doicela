'use client';

import React, { useState } from 'react';
import { useBooks } from '../../hooks/useBooks';

interface BookSelectorProps {
  selectedBookId: number | null;
  onSelectBook: (id: number | null) => void;
}

type TabType = 'ALL' | 'OT' | 'NT';

export function BookSelector({ selectedBookId, onSelectBook }: BookSelectorProps) {
  const { books, loading, error } = useBooks();
  const [activeTab, setActiveTab] = useState<TabType>('ALL');

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 border-b border-accents-2 pb-2">
          <div className="h-4 w-12 bg-accents-1 animate-pulse rounded" />
          <div className="h-4 w-28 bg-accents-1 animate-pulse rounded" />
          <div className="h-4 w-28 bg-accents-1 animate-pulse rounded" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-7 w-20 bg-accents-1 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-xs font-mono">Error: {error}</div>;
  }

  const filteredBooks = books.filter((book) => {
    if (activeTab === 'OT') return book.testament === 'OT';
    if (activeTab === 'NT') return book.testament === 'NT';
    return true;
  });

  const tabClass = (tab: TabType) =>
    `pb-2 text-xs font-medium cursor-pointer transition-colors duration-150 border-b-2 -mb-[1px] ${
      activeTab === tab
        ? 'border-foreground text-foreground font-semibold'
        : 'border-transparent text-accents-5 hover:text-foreground'
    }`;

  return (
    <div className="space-y-4">
      {/* Tabs minimalistas tipo Vercel */}
      <div className="flex gap-6 border-b border-accents-2">
        <button onClick={() => setActiveTab('ALL')} className={tabClass('ALL')}>
          Todos
        </button>
        <button onClick={() => setActiveTab('OT')} className={tabClass('OT')}>
          Antiguo Testamento
        </button>
        <button onClick={() => setActiveTab('NT')} className={tabClass('NT')}>
          Nuevo Testamento
        </button>
      </div>

      {/* Grid de libros */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <button
          onClick={() => onSelectBook(null)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all duration-150 cursor-pointer ${
            selectedBookId === null
              ? 'bg-foreground text-background border-foreground'
              : 'bg-transparent text-accents-5 border-accents-2 hover:text-foreground hover:border-accents-4'
          }`}
        >
          Todos los Libros
        </button>

        {filteredBooks.map((book) => (
          <button
            key={book.id}
            onClick={() => onSelectBook(book.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all duration-150 cursor-pointer ${
              selectedBookId === book.id
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-accents-5 border-accents-2 hover:text-foreground hover:border-accents-4'
            }`}
          >
            {book.name}
          </button>
        ))}
      </div>
    </div>
  );
}

