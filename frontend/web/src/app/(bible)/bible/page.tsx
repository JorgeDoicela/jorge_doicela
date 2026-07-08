'use client';

import React from 'react';
import { VerseList, useVerses } from '../features/verses';
import { BookSelector } from '../features/books';
import { TranslationSelector } from '../features/translations';

export default function BibleHome() {
  const {
    verses,
    loading,
    error,
    selectedBookId,
    setSelectedBookId,
    selectedTranslationId,
    setSelectedTranslationId,
  } = useVerses();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-16 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
          Biblia Modular App
        </h1>
        <p className="text-slate-400 max-w-md mx-auto text-lg">
          Un módulo de lectura y consulta de versículos con bases de datos aisladas e indexación rápida.
        </p>
      </header>

      <main className="w-full max-w-5xl space-y-8">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-200">Filtros de Lectura</h2>
            <TranslationSelector
              selectedTranslationId={selectedTranslationId}
              onSelectTranslation={setSelectedTranslationId}
            />
          </div>
          
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Libros Bíblicos</h3>
            <BookSelector
              selectedBookId={selectedBookId}
              onSelectBook={setSelectedBookId}
            />
          </div>
        </div>

        <VerseList
          verses={verses}
          loading={loading}
          error={error}
        />
      </main>

      <footer className="mt-20 text-slate-500 text-sm">
        Jorge Doicela &copy; {new Date().getFullYear()} — Arquitectura en Capas Decoplada
      </footer>
    </div>
  );
}
