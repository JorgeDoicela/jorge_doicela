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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar superior fija al estilo Vercel */}
      <header className="sticky top-0 z-50 w-full border-b border-accents-2 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 75 65"
              fill="currentColor"
              className="h-4.5 w-4.5 text-foreground"
              aria-label="Vercel Isotype"
            >
              <polygon points="37.5,0 75,65 0,65" />
            </svg>
            <span className="text-accents-2 font-mono select-none">/</span>
            <span className="text-xs font-semibold tracking-widest uppercase">
              Bible
            </span>
          </div>

          <div className="flex items-center gap-4">
            <TranslationSelector
              selectedTranslationId={selectedTranslationId}
              onSelectTranslation={setSelectedTranslationId}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 text-center max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl mb-4 leading-none select-none">
          La Biblia Modular
        </h1>
        <p className="text-accents-5 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Una experiencia de lectura minimalista, veloz y enfocada en el estudio de las Sagradas Escrituras.
        </p>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pb-24 space-y-8">
        {/* Filtro de Libros en un contenedor plano Vercel */}
        <section className="border border-accents-2 rounded-xl bg-background p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-accents-5 mb-4">
            Libros Bíblicos
          </h2>
          <BookSelector
            selectedBookId={selectedBookId}
            onSelectBook={setSelectedBookId}
          />
        </section>

        {/* Listado de Versículos */}
        <section className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-accents-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-accents-5">
              Escrituras
            </h2>
            <span className="text-[10px] font-mono text-accents-4">
              {verses.length} versículos encontrados
            </span>
          </div>
          <VerseList verses={verses} loading={loading} error={error} />
        </section>
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-accents-2 w-full py-8 bg-background">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-accents-4">
          <div>Jorge Doicela &copy; {new Date().getFullYear()}</div>
          <div className="flex gap-4">
            <span className="text-accents-2">|</span>
            <span className="hover:text-foreground transition-colors duration-150 cursor-default">
              Sagradas Escrituras
            </span>
            <span className="text-accents-2">|</span>
            <span className="hover:text-foreground transition-colors duration-150 cursor-default">
              Lectura Modular
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

