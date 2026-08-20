'use client';

import React from 'react';
import {
  MorphologyFilterState,
  LanguageFilter,
  PartOfSpeechFilter,
  VerbalMoodFilter,
  VerbalTenseFilter,
  VerbalVoiceFilter,
  GrammaticalCaseFilter,
  GrammaticalGenderFilter,
  GrammaticalNumberFilter,
  GrammaticalPersonFilter,
  CanonScopeFilter,
} from '../types';
import { CANONICAL_BOOKS } from '../../books/hooks/useBooks';

interface MorphologyFilterFormProps {
  filters: MorphologyFilterState;
  onUpdateFilter: <K extends keyof MorphologyFilterState>(
    key: K,
    value: MorphologyFilterState[K],
  ) => void;
  onResetFilters: () => void;
  onToggleCustomBook: (abbr: string) => void;
}

export const MorphologyFilterForm: React.FC<MorphologyFilterFormProps> = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  onToggleCustomBook,
}) => {
  const quickBooks = [
    { abbr: 'ROM', name: 'Romanos' },
    { abbr: 'GAL', name: 'Gálatas' },
    { abbr: 'JN', name: 'Juan' },
    { abbr: 'EFE', name: 'Efesios' },
    { abbr: 'HEB', name: 'Hebreos' },
    { abbr: 'GEN', name: 'Génesis' },
    { abbr: 'SAL', name: 'Salmos' },
    { abbr: '1JN', name: '1 Juan' },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-accents-2 bg-background space-y-4">
      {/* Barra de búsqueda de texto / lema / Strong */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilter('searchQuery', e.target.value)}
            placeholder="Buscar por Lema (ej. μεταμορφόω, λόγος), Glosa, Strong (G3339, H1254)..."
            className="w-full px-3.5 py-2 pl-9 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground placeholder:text-accents-4 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <svg
            className="w-4 h-4 text-accents-4 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="px-3 py-2 rounded-lg text-xs font-medium border border-accents-2 bg-background hover:bg-accents-1 text-accents-5 hover:text-foreground transition-all cursor-pointer flex items-center justify-center gap-1.5"
          title="Restablecer todos los filtros"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Limpiar Filtros</span>
        </button>
      </div>

      {/* Rejilla de Selectores Gramaticales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Idioma */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            Idioma
          </label>
          <select
            value={filters.language}
            onChange={(e) => onUpdateFilter('language', e.target.value as LanguageFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Cualquier Idioma</option>
            <option value="greek">Griego (NT)</option>
            <option value="hebrew_aramaic">Hebreo / Arameo (AT)</option>
          </select>
        </div>

        {/* Categoría Gramatical (POS) */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            Categoría (POS)
          </label>
          <select
            value={filters.partOfSpeech}
            onChange={(e) => onUpdateFilter('partOfSpeech', e.target.value as PartOfSpeechFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Verbo">Verbo</option>
            <option value="Sustantivo">Sustantivo</option>
            <option value="Adjetivo">Adjetivo</option>
            <option value="Artículo">Artículo</option>
            <option value="Pronombre">Pronombre</option>
            <option value="Preposición">Preposición</option>
            <option value="Conjunción">Conjunción</option>
            <option value="Adverbio">Adverbio</option>
          </select>
        </div>

        {/* Modo Verbal */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            Modo Verbal
          </label>
          <select
            value={filters.mood}
            onChange={(e) => onUpdateFilter('mood', e.target.value as VerbalMoodFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Cualquier Modo</option>
            <option value="Imperativo">Imperativo</option>
            <option value="Indicativo">Indicativo</option>
            <option value="Subjuntivo">Subjuntivo</option>
            <option value="Optativo">Optativo</option>
            <option value="Infinitivo">Infinitivo</option>
            <option value="Participio">Participio</option>
          </select>
        </div>

        {/* Tiempo / Tronco Verbal */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            Tiempo / Binyan
          </label>
          <select
            value={filters.tense}
            onChange={(e) => onUpdateFilter('tense', e.target.value as VerbalTenseFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Cualquier Tiempo</option>
            <option value="Presente">Presente</option>
            <option value="Aoristo">Aoristo</option>
            <option value="Futuro">Futuro</option>
            <option value="Imperfecto">Imperfecto</option>
            <option value="Perfecto">Perfecto</option>
            <option value="Pluscuamperfecto">Pluscuamperfecto</option>
            <option value="Qal">Hebreo Qal</option>
            <option value="Nifal">Hebreo Nif'al</option>
            <option value="Piel">Hebreo Pi'el</option>
            <option value="Hifil">Hebreo Hif'il</option>
            <option value="Hitpael">Hebreo Hitpa'el</option>
          </select>
        </div>

        {/* Voz Verbal */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            Voz Verbal
          </label>
          <select
            value={filters.voice}
            onChange={(e) => onUpdateFilter('voice', e.target.value as VerbalVoiceFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Cualquier Voz</option>
            <option value="Activa">Activa</option>
            <option value="Media">Media</option>
            <option value="Pasiva">Pasiva</option>
            <option value="Media/Pasiva">Media/Pasiva</option>
          </select>
        </div>

        {/* Caso Gramatical */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            Caso Gramatical
          </label>
          <select
            value={filters.grammaticalCase}
            onChange={(e) => onUpdateFilter('grammaticalCase', e.target.value as GrammaticalCaseFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Cualquier Caso</option>
            <option value="Nominativo">Nominativo</option>
            <option value="Genitivo">Genitivo</option>
            <option value="Dativo">Dativo</option>
            <option value="Acusativo">Acusativo</option>
            <option value="Vocativo">Vocativo</option>
          </select>
        </div>

        {/* Género */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            Género
          </label>
          <select
            value={filters.gender}
            onChange={(e) => onUpdateFilter('gender', e.target.value as GrammaticalGenderFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Cualquier Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Neutro">Neutro</option>
            <option value="Común">Común</option>
          </select>
        </div>

        {/* Número */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            Número
          </label>
          <select
            value={filters.number}
            onChange={(e) => onUpdateFilter('number', e.target.value as GrammaticalNumberFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Cualquier Número</option>
            <option value="Singular">Singular</option>
            <option value="Plural">Plural</option>
            <option value="Dual">Dual</option>
          </select>
        </div>

        {/* Persona */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            Persona
          </label>
          <select
            value={filters.person}
            onChange={(e) => onUpdateFilter('person', e.target.value as GrammaticalPersonFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Cualquier Persona</option>
            <option value="1ª persona">1ª Persona</option>
            <option value="2ª persona">2ª Persona</option>
            <option value="3ª persona">3ª Persona</option>
          </select>
        </div>

        {/* Alcance Canónico */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            Ámbito Canónico
          </label>
          <select
            value={filters.scope}
            onChange={(e) => onUpdateFilter('scope', e.target.value as CanonScopeFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Todo el Canon (66 Libros)</option>
            <option value="OT">Antiguo Testamento (39)</option>
            <option value="NT">Nuevo Testamento (27)</option>
            <option value="pentateuch">Pentateuco / Torá</option>
            <option value="history">Libros Históricos</option>
            <option value="poetry">Poéticos y Sapienciales</option>
            <option value="prophets">Profetas Mayores / Menores</option>
            <option value="gospels">Evangelios</option>
            <option value="pauline">Epístolas Paulinas</option>
            <option value="general_epistles">Epístolas Generales</option>
            <option value="revelation">Apocalipsis</option>
            <option value="custom_books">Selección Específica</option>
          </select>
        </div>
      </div>

      {/* Selector Rápido de Libros Específicos */}
      <div className="pt-2 border-t border-accents-2 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono text-accents-5 uppercase font-medium">
          Selección Rápida de Libros:
        </span>
        {quickBooks.map((b) => {
          const isSelected = filters.customBookAbbrs.includes(b.abbr);
          return (
            <button
              key={b.abbr}
              type="button"
              onClick={() => onToggleCustomBook(b.abbr)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-blue-500 text-white border-blue-500 font-semibold'
                  : 'bg-accents-1 hover:bg-accents-2 text-accents-5 border-accents-2'
              }`}
            >
              {b.abbr} ({b.name})
            </button>
          );
        })}
      </div>
    </div>
  );
};
