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
    return <div className="text-slate-400 text-sm">Cargando libros...</div>;
  }

  if (error) {
    return <div className="text-rose-400 text-sm">Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectBook(null)}
        className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
          selectedBookId === null
            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
        }`}
      >
        Todos los Libros
      </button>

      {books.map((book) => (
        <button
          key={book.id}
          onClick={() => onSelectBook(book.id)}
          className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
            selectedBookId === book.id
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
          }`}
        >
          {book.name} ({book.abbreviation})
        </button>
      ))}
    </div>
  );
}
