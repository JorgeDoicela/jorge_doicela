'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('GrammarSearch');

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
            placeholder={t('searchPlaceholder')}
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
          title={t('resetFiltersTooltip')}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{t('resetFilters')}</span>
        </button>
      </div>

      {/* Rejilla de Selectores Gramaticales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Idioma */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            {t('fields.language')}
          </label>
          <select
            value={filters.language}
            onChange={(e) => onUpdateFilter('language', e.target.value as LanguageFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">{t('options.allLanguages')}</option>
            <option value="greek">{t('options.greek')}</option>
            <option value="hebrew_aramaic">{t('options.hebrewAramaic')}</option>
          </select>
        </div>

        {/* Categoría Gramatical (POS) */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            {t('fields.partOfSpeech')}
          </label>
          <select
            value={filters.partOfSpeech}
            onChange={(e) => onUpdateFilter('partOfSpeech', e.target.value as PartOfSpeechFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">{t('options.allPos')}</option>
            <option value="Verbo">{t('options.verb')}</option>
            <option value="Sustantivo">{t('options.noun')}</option>
            <option value="Adjetivo">{t('options.adjective')}</option>
            <option value="Artículo">{t('options.article')}</option>
            <option value="Pronombre">{t('options.pronoun')}</option>
            <option value="Preposición">{t('options.preposition')}</option>
            <option value="Conjunción">{t('options.conjunction')}</option>
            <option value="Adverbio">{t('options.adverb')}</option>
          </select>
        </div>

        {/* Modo Verbal */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            {t('fields.mood')}
          </label>
          <select
            value={filters.mood}
            onChange={(e) => onUpdateFilter('mood', e.target.value as VerbalMoodFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">{t('options.allMoods')}</option>
            <option value="Imperativo">{t('options.imperative')}</option>
            <option value="Indicativo">{t('options.indicative')}</option>
            <option value="Subjuntivo">{t('options.subjunctive')}</option>
            <option value="Optativo">{t('options.optative')}</option>
            <option value="Infinitivo">{t('options.infinitive')}</option>
            <option value="Participio">{t('options.participle')}</option>
          </select>
        </div>

        {/* Tiempo / Tronco Verbal */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            {t('fields.tense')}
          </label>
          <select
            value={filters.tense}
            onChange={(e) => onUpdateFilter('tense', e.target.value as VerbalTenseFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">{t('options.allTenses')}</option>
            <option value="Presente">{t('options.present')}</option>
            <option value="Aoristo">{t('options.aorist')}</option>
            <option value="Futuro">{t('options.future')}</option>
            <option value="Imperfecto">{t('options.imperfect')}</option>
            <option value="Perfecto">{t('options.perfect')}</option>
            <option value="Pluscuamperfecto">{t('options.pluperfect')}</option>
            <option value="Qal">{t('options.qal')}</option>
            <option value="Nifal">{t('options.nifal')}</option>
            <option value="Piel">{t('options.piel')}</option>
            <option value="Hifil">{t('options.hifil')}</option>
            <option value="Hitpael">{t('options.hitpael')}</option>
          </select>
        </div>

        {/* Voz Verbal */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            {t('fields.voice')}
          </label>
          <select
            value={filters.voice}
            onChange={(e) => onUpdateFilter('voice', e.target.value as VerbalVoiceFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">{t('options.allVoices')}</option>
            <option value="Activa">{t('options.active')}</option>
            <option value="Media">{t('options.middle')}</option>
            <option value="Pasiva">{t('options.passive')}</option>
            <option value="Media/Pasiva">{t('options.middlePassive')}</option>
          </select>
        </div>

        {/* Caso Gramatical */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            {t('fields.grammaticalCase')}
          </label>
          <select
            value={filters.grammaticalCase}
            onChange={(e) => onUpdateFilter('grammaticalCase', e.target.value as GrammaticalCaseFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">{t('options.allCases')}</option>
            <option value="Nominativo">{t('options.nominative')}</option>
            <option value="Genitivo">{t('options.genitivo') || 'Genitivo'}</option>
            <option value="Dativo">{t('options.dative')}</option>
            <option value="Acusativo">{t('options.accusative')}</option>
            <option value="Vocativo">{t('options.vocative')}</option>
          </select>
        </div>

        {/* Género */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            {t('fields.gender')}
          </label>
          <select
            value={filters.gender}
            onChange={(e) => onUpdateFilter('gender', e.target.value as GrammaticalGenderFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">{t('options.allGenders')}</option>
            <option value="Masculino">{t('options.masculine')}</option>
            <option value="Femenino">{t('options.feminine')}</option>
            <option value="Neutro">{t('options.neuter')}</option>
            <option value="Común">{t('options.common')}</option>
          </select>
        </div>

        {/* Número */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            {t('fields.number')}
          </label>
          <select
            value={filters.number}
            onChange={(e) => onUpdateFilter('number', e.target.value as GrammaticalNumberFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">{t('options.allNumbers')}</option>
            <option value="Singular">{t('options.singular')}</option>
            <option value="Plural">{t('options.plural')}</option>
            <option value="Dual">{t('options.dual')}</option>
          </select>
        </div>

        {/* Persona */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            {t('fields.person')}
          </label>
          <select
            value={filters.person}
            onChange={(e) => onUpdateFilter('person', e.target.value as GrammaticalPersonFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">{t('options.allPersons')}</option>
            <option value="1ª persona">{t('options.person1')}</option>
            <option value="2ª persona">{t('options.person2')}</option>
            <option value="3ª persona">{t('options.person3')}</option>
          </select>
        </div>

        {/* Alcance Canónico */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-accents-5">
            {t('fields.scope')}
          </label>
          <select
            value={filters.scope}
            onChange={(e) => onUpdateFilter('scope', e.target.value as CanonScopeFilter)}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">{t('options.allCanon')}</option>
            <option value="OT">{t('options.ot')}</option>
            <option value="NT">{t('options.nt')}</option>
            <option value="pentateuch">{t('options.pentateuch')}</option>
            <option value="history">{t('options.history')}</option>
            <option value="poetry">{t('options.poetry')}</option>
            <option value="prophets">{t('options.prophets')}</option>
            <option value="gospels">{t('options.gospels')}</option>
            <option value="pauline">{t('options.pauline')}</option>
            <option value="general_epistles">{t('options.generalEpistles')}</option>
            <option value="revelation">{t('options.revelation')}</option>
            <option value="custom_books">{t('options.customBooks')}</option>
          </select>
        </div>
      </div>

      {/* Selector Rápido de Libros Específicos */}
      <div className="pt-2 border-t border-accents-2 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono text-accents-5 uppercase font-medium">
          {t('quickBooksLabel')}
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
