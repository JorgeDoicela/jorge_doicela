'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Compass,
  MapPin,
  Building2,
  Calendar,
  Layers,
  BookOpen,
  Scroll,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { ArchaeologyArticle } from '../../types';
import { useArchaeologyContextSafe } from '../../context/ArchaeologyContext';
import { StudySidePanel } from '../../../../shared/ui';

interface ArchaeologyInspectorProps {
  article?: ArchaeologyArticle | null;
}

export const ArchaeologyInspector: React.FC<ArchaeologyInspectorProps> = ({
  article: propArticle,
}) => {
  const archContext = useArchaeologyContextSafe();
  const tStudio = useTranslations('Studio');

  const article = propArticle ?? archContext?.activeArticle ?? null;

  return (
    <StudySidePanel
      side="right"
      title="Ficha Arqueológica"
      icon={<Compass className="w-4 h-4 text-emerald-500" />}
      storageKey="bible_archaeology_inspector_w"
      defaultWidth={360}
      collapseTitle={tStudio('closeInspector') || 'Ocultar inspector'}
    >
      <StudySidePanel.Body className="space-y-4">
          {article ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase border border-emerald-500/20">
                    {article.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {article.publishDate}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {article.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{article.regionLabel}</span>
                </div>
              </div>

              {/* Ficha Técnica del Hallazgo */}
              <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Metadatos de Excavación
                </span>
                <div className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span><strong>Institución:</strong> {article.institutionOrAuthor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span><strong>Artefacto clave:</strong> {article.keyArtifact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span><strong>Custodia / Museo:</strong> {article.museumOrLocation}</span>
                  </div>
                </div>
              </div>

              {/* Transcripción Epigráfica */}
              {article.epigraphy && (
                <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <Scroll className="w-3.5 h-3.5" />
                    <span>Epigrafía e Inscripción</span>
                  </div>
                  <div className="font-serif text-sm tracking-wide text-zinc-800 dark:text-zinc-200 bg-white/80 dark:bg-black/60 p-2 rounded border border-amber-500/10">
                    {article.epigraphy.originalScript}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    {article.epigraphy.transliteration}
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 italic">
                    "{article.epigraphy.translation}"
                  </p>
                </div>
              )}

              {/* Pasajes Bíblicos Respaldados */}
              {article.biblicalReferences && article.biblicalReferences.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold px-1">
                    Pasajes Bíblicos Respaldados
                  </span>
                  <div className="space-y-2">
                    {article.biblicalReferences.map((ref, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs space-y-1"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                          <BookOpen className="w-3 h-3 text-emerald-500" />
                          <span>{ref.reference}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {ref.context}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
              <Compass className="w-8 h-8 text-emerald-500/60 mx-auto" />
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Ficha Técnica de Excavación
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Selecciona un reporte arqueológico o manuscrito del catálogo para examinar sus evidencias estratigráficas, transcripciones y conexiones bíblicas.
              </p>
            </div>
          )}
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};
