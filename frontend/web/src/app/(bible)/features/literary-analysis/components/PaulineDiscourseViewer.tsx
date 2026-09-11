'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  PaulinePassageDiscourse,
  DiscourseClause,
  ConjunctionCategory,
} from '../types';
import { fetchPaulineDiscourses } from '../services/literaryApiService';

export const PaulineDiscourseViewer: React.FC = () => {
  const t = useTranslations('LiteraryAnalysis');
  const locale = useLocale();

  const [passages, setPassages] = useState<PaulinePassageDiscourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPassageId, setSelectedPassageId] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<ConjunctionCategory | 'all'>('all');
  const [selectedClause, setSelectedClause] = useState<DiscourseClause | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchPaulineDiscourses(locale).then((data) => {
      if (!isMounted) return;
      setPassages(data);
      if (data.length > 0) {
        setSelectedPassageId(data[0].id);
      }
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [locale]);

  const currentPassage =
    passages.find((p) => p.id === selectedPassageId) ||
    passages[0] ||
    null;

  if (loading) {
    return (
      <div className="p-12 text-center rounded-2xl border border-accents-2 bg-accents-1/30 space-y-3 animate-pulse">
        <div className="h-4 w-48 bg-accents-2 rounded mx-auto" />
        <div className="h-3 w-64 bg-accents-2/60 rounded mx-auto" />
      </div>
    );
  }

  if (!currentPassage) {
    return (
      <div className="p-12 text-center rounded-2xl border border-accents-2 bg-accents-1/30 space-y-2">
        <div className="text-sm font-semibold text-foreground">{t('paulineTab')}</div>
      </div>
    );
  }

  const getConjunctionBadgeStyle = (category?: ConjunctionCategory) => {
    switch (category) {
      case 'causal':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'purpose':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'conditional':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'inferential':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'adversative':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-accents-2 text-accents-5 border-accents-3';
    }
  };

  const getIndentationClass = (level: number) => {
    switch (level) {
      case 0:
        return 'ml-0 border-l-4 border-foreground bg-accents-1/60';
      case 1:
        return 'ml-4 sm:ml-8 border-l-2 border-accents-3 bg-background';
      case 2:
        return 'ml-8 sm:ml-16 border-l-2 border-accents-2 bg-background/80';
      case 3:
        return 'ml-12 sm:ml-24 border-l-2 border-accents-2 bg-background/60';
      default:
        return 'ml-4 border-l border-accents-2';
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Pasaje Paulino y Filtros de Conjunciones */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border border-accents-2 bg-background shadow-xs">
        {/* Selector de Pasaje */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-accents-4 uppercase tracking-wider">
            {t('epistleLabel')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {passages.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedPassageId(item.id);
                  setSelectedClause(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedPassageId === item.id
                    ? 'bg-foreground text-background shadow-xs'
                    : 'bg-accents-1 text-accents-4 hover:text-foreground border border-accents-2'
                }`}
              >
                {item.passageRef} ({item.bookName})
              </button>
            ))}
          </div>
        </div>

        {/* Filtro por Categoría de Conjunción Griega */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-mono text-accents-4 uppercase">
            {t('connectorFilter')}
          </span>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeCategoryFilter === 'all'
                ? 'bg-foreground text-background font-bold'
                : 'bg-accents-1 text-accents-4 hover:text-foreground border border-accents-2'
            }`}
          >
            {t('allConnectors')}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('causal')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeCategoryFilter === 'causal'
                ? 'bg-blue-500 text-white font-bold'
                : 'text-blue-500 hover:bg-blue-500/10 border border-blue-500/30'
            }`}
            title={t('causalTooltip')}
          >
            {t('causal')}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('purpose')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeCategoryFilter === 'purpose'
                ? 'bg-emerald-500 text-black font-bold'
                : 'text-emerald-500 hover:bg-emerald-500/10 border border-emerald-500/30'
            }`}
            title={t('purposeTooltip')}
          >
            {t('purpose')}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('inferential')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeCategoryFilter === 'inferential'
                ? 'bg-purple-500 text-white font-bold'
                : 'text-purple-400 hover:bg-purple-500/10 border border-purple-500/30'
            }`}
            title={t('inferentialTooltip')}
          >
            {t('inferential')}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('adversative')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeCategoryFilter === 'adversative'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-rose-400 hover:bg-rose-500/10 border border-rose-500/30'
            }`}
            title={t('adversativeTooltip')}
          >
            {t('adversative')}
          </button>
        </div>
      </div>

      {/* Encabezado del Pasaje y Tesis Dogmática */}
      <div className="p-5 sm:p-6 rounded-2xl border border-accents-2 bg-accents-1/30 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {currentPassage.title}
            </h3>
            <p className="text-xs text-accents-4 font-mono">
              {t('theologicalTheme')}{' '}
              <strong className="text-foreground">{currentPassage.theologicalTheme}</strong>
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-foreground text-background font-bold">
            {currentPassage.passageRef}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-background border border-accents-2 text-xs space-y-1">
          <span className="font-mono text-[10px] uppercase font-bold text-accents-4">
            {t('discourseThesis')}
          </span>
          <p className="text-foreground font-semibold leading-relaxed">
            {currentPassage.centralProposition}
          </p>
        </div>
      </div>

      {/* Diagramación de Bloques / Árbol de Cláusulas (Pauline Phrasing) */}
      <div className="p-5 sm:p-6 rounded-2xl border border-accents-2 bg-background space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-accents-2 pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-accents-4">
            {t('blockDiagramTitle')}
          </span>
          <span className="text-[11px] font-mono text-accents-4">
            {t('propositionsCount', { count: currentPassage.clauses.length })}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {currentPassage.clauses.map((clause) => {
            const isMatchCategory =
              activeCategoryFilter === 'all' ||
              clause.conjunction?.category === activeCategoryFilter;

            const isSelected = selectedClause?.id === clause.id;

            return (
              <div
                key={clause.id}
                onClick={() => setSelectedClause(clause)}
                className={`p-4 rounded-xl transition-all duration-150 cursor-pointer ${getIndentationClass(
                  clause.indentationLevel,
                )} ${
                  !isMatchCategory
                    ? 'opacity-35 hover:opacity-100'
                    : isSelected
                    ? 'ring-2 ring-foreground shadow-md bg-accents-1'
                    : 'hover:bg-accents-1/70'
                }`}
              >
                <div className="space-y-2">
                  {/* Fila superior: Versículo, Conector y Tipo */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-foreground">
                      {clause.verseRef}
                    </span>

                    {/* Badge de Conjunción Griega */}
                    {clause.conjunction && (
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-mono font-bold ${getConjunctionBadgeStyle(
                          clause.conjunction.category,
                        )}`}
                        title={clause.conjunction.syntacticRole}
                      >
                        <span className="font-serif">{clause.conjunction.greek}</span>
                        <span className="opacity-70">({clause.conjunction.gloss})</span>
                      </div>
                    )}

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        clause.clauseType === 'main'
                          ? 'bg-foreground text-background font-bold uppercase'
                          : 'bg-accents-1 text-accents-4 border border-accents-2'
                      }`}
                    >
                      {clause.clauseType === 'main' ? t('mainClause') : t('subordinateClause')}
                    </span>
                  </div>

                  {/* Texto de la Proposición (Bilingüe) */}
                  <p
                    className={`font-serif leading-relaxed ${
                      clause.clauseType === 'main'
                        ? 'text-foreground font-bold text-base sm:text-lg'
                        : 'text-foreground/90 text-sm sm:text-base'
                    }`}
                  >
                    «{(clause as any).text || clause.textSpanish}»
                  </p>

                  {/* Texto en Griego */}
                  {clause.textGreek && (
                    <div
                      lang="el"
                      className="text-sm font-serif text-accents-5 select-text pt-0.5"
                      style={{ fontFamily: '"Gentium Plus", "SBL Greek", serif' }}
                    >
                      {clause.textGreek}
                    </div>
                  )}

                  {/* Resumen del Flujo Teológico */}
                  <div className="pt-2 border-t border-accents-2/60 text-xs text-accents-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] uppercase font-bold text-accents-5">
                        {t('theologicalFlow')}
                      </span>
                      <span className="text-accents-5">{clause.theologicalFlow}</span>
                    </div>

                    <span className="text-[10px] font-mono text-accents-4 italic">
                      {clause.grammaticalAnalysis}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalle Exegético de la Cláusula Seleccionada */}
      {selectedClause && (
        <div className="p-5 rounded-2xl bg-accents-1 border border-accents-2 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-foreground uppercase">
              {t('syntacticAnalysis')} {selectedClause.verseRef}
            </h4>
            <span className="text-[11px] font-mono text-accents-4">
              {t('indentationLevel', { level: selectedClause.indentationLevel })}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-background border border-accents-2 space-y-1">
              <span className="text-[10px] font-mono text-accents-4 uppercase block">
                {t('grammaticalFunction')}
              </span>
              <p className="font-semibold text-foreground">
                {selectedClause.grammaticalAnalysis}
              </p>
            </div>

            {selectedClause.conjunction && (
              <div className="p-3 rounded-xl bg-background border border-accents-2 space-y-1">
                <span className="text-[10px] font-mono text-accents-4 uppercase block">
                  {t('connectorRole', { greek: selectedClause.conjunction.greek })}
                </span>
                <p className="font-semibold text-foreground">
                  {selectedClause.conjunction.syntacticRole}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
