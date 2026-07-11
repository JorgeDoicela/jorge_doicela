'use client';

import React from 'react';
import { VerseList, useVerses } from '../features/verses';
import { BookSelector } from '../features/books';
import { TranslationSelector } from '../features/translations';
import { ThemeToggle } from '../components/ThemeToggle';

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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-4xl flex justify-end mb-6">
        <ThemeToggle />
      </div>

      <header className="mb-12 text-center max-w-xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          Biblia Modular
        </h1>
        <p className="text-accents-5 text-base">
          Módulo de lectura y consulta de versículos con bases de datos aisladas e indexación rápida.
        </p>
      </header>


      <main className="w-full max-w-4xl space-y-8">
        <div className="p-6 rounded-lg bg-card-bg border border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Filtros de Lectura</h2>
            <TranslationSelector
              selectedTranslationId={selectedTranslationId}
              onSelectTranslation={setSelectedTranslationId}
            />
          </div>
          
          <div className="border-t border-border pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accents-5 mb-3">Libros Bíblicos</h3>
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

      <footer className="mt-24 text-accents-4 text-xs font-mono">
        Jorge Doicela &copy; {new Date().getFullYear()} — Arquitectura Aislada
      </footer>
    </div>
  );
}

