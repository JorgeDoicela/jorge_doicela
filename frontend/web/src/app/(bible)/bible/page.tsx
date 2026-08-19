'use client';

import React, { useState } from 'react';
import { VerseList, useVerses } from '../features/verses';
import { BookSelector, useBooks } from '../features/books';
import { TranslationSelector, useTranslations } from '../features/translations';
import {
  ParallelToolbar,
  ParallelViewGrid,
  useParallelVerses,
  ParallelVerseRow,
  BibleStudyMode,
} from '../features/parallel-view';
import { TextualDiffModal, VerseComparisonData } from '../features/textual-diff';
import { InterlinearView } from '../features/interlinear';
import { LiteraryAnalysisView } from '../features/literary-analysis';
import { LexiconView } from '../features/lexicons';
import { GrammarSearchDashboard } from '../features/grammar-search';
import { AtlasDashboard } from '../features/atlas';
import { TimelineDashboard } from '../features/timeline';
import { ArchaeologyFeedDashboard } from '../features/archaeology-feed';
import { ThemeToggle } from '../components/ThemeToggle';



export default function BibleHome() {
  const [studyMode, setStudyMode] = useState<BibleStudyMode>('standard');
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [activeDiffData, setActiveDiffData] = useState<VerseComparisonData | null>(null);
  const [rowVersesMap, setRowVersesMap] = useState<
    Record<number, { text: string; name: string; abbreviation: string }>
  >({});

  // Hook de traducción y versículos estándar
  const {
    verses,
    loading: versesLoading,
    error: versesError,
    selectedBookId,
    setSelectedBookId,
    selectedTranslationId,
    setSelectedTranslationId,
  } = useVerses();

  const { books } = useBooks();
  const { translations } = useTranslations();

  const selectedBook = books.find((b) => b.id === selectedBookId);

  // Hook para gestión de columnas y filas paralelas
  const {
    columns,
    rows,
    loading: parallelLoading,
    error: parallelError,
    addColumn,
    removeColumn,
    updateColumnTranslation,
  } = useParallelVerses(
    selectedBookId,
    null,
    selectedTranslationId ? [selectedTranslationId, selectedTranslationId === 1 ? 2 : 1] : [1, 2],
  );

  const handleOpenDiffModal = (row: ParallelVerseRow) => {
    // Obtener los datos de todas las traducciones disponibles en esta fila
    const validTranslations = Object.values(row.translations).filter(
      (v): v is NonNullable<typeof v> => v !== null,
    );

    if (validTranslations.length < 2) {
      return;
    }

    const tA = validTranslations[0];
    const tB = validTranslations[1];

    const map: Record<number, { text: string; name: string; abbreviation: string }> = {};
    for (const item of validTranslations) {
      map[item.translationId] = {
        text: item.text,
        name: item.translationName,
        abbreviation: item.translationAbbreviation,
      };
    }

    setRowVersesMap(map);
    setActiveDiffData({
      bookName: tA.bookName,
      chapter: tA.chapter,
      verseNumber: row.verseNumber,
      translationA: {
        id: tA.translationId,
        abbreviation: tA.translationAbbreviation,
        name: tA.translationName,
        text: tA.text,
      },
      translationB: {
        id: tB.translationId,
        abbreviation: tB.translationAbbreviation,
        name: tB.translationName,
        text: tB.text,
      },
    });
    setDiffModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar superior fija al estilo Vercel */}
      <header className="sticky top-0 z-50 w-full border-b border-accents-2 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
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
            {studyMode === 'standard' && (
              <TranslationSelector
                selectedTranslationId={selectedTranslationId}
                onSelectTranslation={setSelectedTranslationId}
              />
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 text-center max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-3 leading-none select-none">
          La Biblia Modular
        </h1>
        <p className="text-accents-5 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Plataforma de lectura, estudio comparativo y exégesis morfológica profunda de las Sagradas Escrituras en lenguas originales y traducciones globales.
        </p>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24 space-y-6">
        {/* Filtro de Libros en un contenedor plano Vercel */}
        <section className="border border-accents-2 rounded-xl bg-background p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-accents-5">
              Libros Bíblicos
            </h2>
            <span className="text-[11px] font-mono text-accents-4">
              Antiguo y Nuevo Testamento
            </span>
          </div>
          <BookSelector
            selectedBookId={selectedBookId}
            onSelectBook={setSelectedBookId}
          />
        </section>

        {/* Barra de herramientas y alternancia de modo */}
        <ParallelToolbar
          studyMode={studyMode}
          onChangeStudyMode={setStudyMode}
          columnCount={columns.length}
          availableTranslations={translations}
          activeTranslationIds={columns.map((c) => c.translationId)}
          onAddColumn={addColumn}
        />

        {/* Sección de Escrituras */}
        <section className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-accents-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-accents-5">
              {studyMode === 'parallel'
                ? 'Estudio Comparativo en Paralelo'
                : studyMode === 'interlinear'
                ? 'Modo Interlineal Inverso e Interactivo'
                : studyMode === 'literary'
                ? 'Análisis de Estructuras Literarias, Quiasmos y Discurso Paulino'
                : studyMode === 'lexicon'
                ? 'Motor Lingüístico y Diccionarios Léxicos Integrados'
                : studyMode === 'grammar-search'
                ? 'Búsqueda Morfológica, Scatter Plot Canónico y Concordancia FTS5'
                : studyMode === 'atlas'
                ? 'Atlas Bíblico Georreferenciado, Rutas Históricas y Visualizador 3D'
                : studyMode === 'timeline'
                ? 'Línea de Tiempo Cronológica Dinámica y Sincronismo Histórico'
                : studyMode === 'archaeology'
                ? 'Actualidad Arqueológica, Manuscritos de Qumrán y Apologética'
                : 'Lectura de Escrituras'}
            </h2>
            <span className="text-[10px] font-mono text-accents-4">
              {studyMode === 'parallel'
                ? `${rows.length} versículos alineados (${columns.length} versiones)`
                : studyMode === 'interlinear'
                ? 'Interlineal Español ↔ Hebreo/Arameo/Griego'
                : studyMode === 'literary'
                ? 'Patrones Poéticos Semíticos & Gramática del Discurso'
                : studyMode === 'lexicon'
                ? 'BDB • Gesenius • DTAT • Thayer • LSJ • Robertson • Vincent'
                : studyMode === 'grammar-search'
                ? 'Parsing Robinson • Densidad Canónica • Búsqueda Booleana'
                : studyMode === 'atlas'
                ? 'Cartografía WGS84 • Itinerarios Bíblicos • Modelos 3D Arqueológicos'
                : studyMode === 'timeline'
                ? 'Reyes de Judá & Israel • Profetas • Imperios Mundiales • Arqueología'
                : studyMode === 'archaeology'
                ? 'Excavaciones en Tierra Santa • Rollos del Mar Muerto • Epigrafía'
                : `${verses.length} versículos encontrados`}
            </span>
          </div>

          {studyMode === 'parallel' ? (
            <ParallelViewGrid
              columns={columns}
              rows={rows}
              loading={parallelLoading}
              error={parallelError}
              availableTranslations={translations}
              onSelectTranslation={updateColumnTranslation}
              onRemoveColumn={removeColumn}
              onCompareRow={handleOpenDiffModal}
            />
          ) : studyMode === 'interlinear' ? (
            <InterlinearView selectedBookAbbr={selectedBook?.abbreviation} />
          ) : studyMode === 'literary' ? (
            <LiteraryAnalysisView />
          ) : studyMode === 'lexicon' ? (
            <LexiconView />
          ) : studyMode === 'grammar-search' ? (
            <GrammarSearchDashboard />
          ) : studyMode === 'atlas' ? (
            <AtlasDashboard />
          ) : studyMode === 'timeline' ? (
            <TimelineDashboard />
          ) : studyMode === 'archaeology' ? (
            <ArchaeologyFeedDashboard />
          ) : (
            <VerseList
              verses={verses}
              loading={versesLoading}
              error={versesError}
            />
          )}


        </section>
      </main>

      {/* Modal de análisis de variantes textuales */}
      <TextualDiffModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        initialData={activeDiffData}
        availableTranslations={translations}
        allVersesByTranslation={rowVersesMap}
      />

      {/* Footer minimalista */}
      <footer className="border-t border-accents-2 w-full py-8 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-accents-4">
          <div>Jorge Doicela &copy; {new Date().getFullYear()}</div>
          <div className="flex gap-4">
            <span className="text-accents-2">|</span>
            <span className="hover:text-foreground transition-colors duration-150 cursor-default">
              Sagradas Escrituras
            </span>
            <span className="text-accents-2">|</span>
            <span className="hover:text-foreground transition-colors duration-150 cursor-default">
              Lectura Multi-Versión
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}


