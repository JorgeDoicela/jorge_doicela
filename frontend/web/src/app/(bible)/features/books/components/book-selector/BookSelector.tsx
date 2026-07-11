'use client';

import React from 'react';
import { useBooks } from '../../hooks/useBooks';

interface BookSelectorProps {
  selectedBookId: number | null;
  onSelectBook: (id: number | null) => void;
}

export function BookSelector({ selectedBookId, onSelectBook }: BookSelectorProps) {
  const { books, loading, error } = useBooks();

  if (loading) {
    return <div className="text-accents-5 text-sm animate-pulse">Cargando libros...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm font-medium">Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectBook(null)}
        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-200 ${
          selectedBookId === null
            ? 'bg-btn-p-bg text-btn-p-fg border-foreground'
            : 'bg-transparent text-accents-5 border-border hover:text-foreground hover:border-accents-5'
        }`}
      >
        Todos los Libros
      </button>

      {books.map((book) => (
        <button
          key={book.id}
          onClick={() => onSelectBook(book.id)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-200 ${
            selectedBookId === book.id
              ? 'bg-btn-p-bg text-btn-p-fg border-foreground'
              : 'bg-transparent text-accents-5 border-border hover:text-foreground hover:border-accents-5'
          }`}
        >
          {book.name} ({book.abbreviation})
        </button>
      ))}
    </div>
  );
}

