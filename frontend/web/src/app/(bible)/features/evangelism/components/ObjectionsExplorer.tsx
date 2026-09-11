'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { EvangelismObjection } from '../types';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';

interface ObjectionsExplorerProps {
  objections: EvangelismObjection[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading: boolean;
}

export const ObjectionsExplorer: React.FC<ObjectionsExplorerProps> = ({
  objections,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  isLoading,
}) => {
  const t = useTranslations('Evangelism');
  const [expandedId, setExpandedId] = useState<string | null>(objections[0]?.id || null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: t('catAll') },
    { key: 'teodicea', label: t('catTheodicy') },
    { key: 'pluralismo', label: t('catPluralism') },
    { key: 'moralismo', label: t('catMoralism') },
    { key: 'gracia', label: t('catGrace') },
  ];

  const handleCopy = (ref: string, text: string) => {
    navigator.clipboard.writeText(`"${text}" (${ref})`);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-5">
      {/* Barra de Búsqueda y Filtros de Categorías */}
      <div className="space-y-3 border-b border-accents-2 pb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-accents-4 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchObjectionPlaceholder')}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-accents-2 bg-background hover:border-accents-3 focus:border-foreground text-xs text-foreground placeholder:text-accents-4 transition-all outline-hidden"
          />
        </div>

        {/* Chips de Categorías */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => onSelectCategory(cat.key)}
                className={`h-7 px-3 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-foreground text-background font-semibold shadow-2xs'
                    : 'bg-accents-1 text-accents-5 hover:text-foreground hover:bg-accents-2 border border-accents-2'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-24 bg-accents-2/40 rounded-xl" />
          <div className="h-24 bg-accents-2/40 rounded-xl" />
        </div>
      ) : objections.length === 0 ? (
        <div className="p-8 text-center border border-accents-2 rounded-xl text-accents-4">
          {t('noObjectionsFound')}
        </div>
      ) : (
        /* Lista de Tarjetas de Preguntas Apologéticas */
        <div className="space-y-3">
          {objections.map((obj) => {
            const isExpanded = expandedId === obj.id;
            return (
              <div
                key={obj.id}
                className="rounded-xl border border-accents-2 bg-background overflow-hidden transition-all"
              >
                {/* Cabecera de la Tarjeta (Clickeable) */}
                <button
                  type="button"
                  onClick={() => toggleExpand(obj.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 cursor-pointer hover:bg-accents-1/40 transition-colors"
                >
                  <div className="space-y-1 pr-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-accents-4 block">
                      {obj.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                      {obj.question}
                    </h3>
                    <p className="text-xs text-accents-5 leading-relaxed pt-0.5">
                      {obj.summary}
                    </p>
                  </div>
                  <div className="p-1 rounded text-accents-4 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Contenido Desplegable Completo */}
                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 space-y-4 border-t border-accents-2 pt-4 animate-in fade-in duration-150">
                    {/* Respuesta Bíblica Profunda */}
                    <div className="space-y-1.5">
                      <h4 className="text-[11px] font-mono uppercase tracking-wider text-accents-4 font-semibold">
                        {t('biblicalAnswerTitle')}
                      </h4>
                      <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                        {obj.biblicalAnswer}
                      </p>
                    </div>

                    {/* Pasajes Clave con Botón de Copiado */}
                    {obj.keyVerses && obj.keyVerses.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-accents-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-accents-4 font-semibold block">
                          {t('scriptureSupportTitle')}
                        </span>
                        <div className="space-y-2">
                          {obj.keyVerses.map((v, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-lg border border-accents-2 bg-background flex items-start justify-between gap-3 group"
                            >
                              <div className="space-y-0.5">
                                <span className="text-xs font-mono font-semibold text-foreground">
                                  {v.ref}
                                </span>
                                <p className="text-xs text-foreground font-serif italic">
                                  "{v.text}"
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopy(v.ref, v.text)}
                                title={t('copyVerseTooltip')}
                                className="p-1.5 rounded text-accents-4 hover:text-foreground hover:bg-accents-1 transition-colors cursor-pointer shrink-0"
                              >
                                {copiedRef === v.ref ? (
                                  <Check className="w-3.5 h-3.5 text-foreground" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Consejo Práctico para el Evangelizador */}
                    {obj.practicalAdvice && (
                      <div className="space-y-1 pt-3 border-t border-accents-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-accents-4 font-semibold block">
                          {t('pastoralAdviceTitle')}
                        </span>
                        <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                          {obj.practicalAdvice}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
