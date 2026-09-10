'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { AiResource } from '../../../features/ai/types';
import { API_URL } from '../../../../config';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';

export default function AiDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const [resource, setResource] = useState<AiResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await fetch(`${API_URL}/software/ai/${slug}?lang=${locale}`);
        if (!res.ok) throw new Error('Recurso no encontrado');
        const data = await res.json();
        setResource(data.data || data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar recurso');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex justify-center items-center bg-[var(--background)]">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-xs font-mono">
          Cargando ficha técnica de IA...
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col justify-center items-center gap-4 bg-[var(--background)]">
        <p className="text-rose-500 font-mono text-sm">{error || 'Recurso no encontrado'}</p>
        <Link href="/software/ai" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-indigo-400 hover:text-white transition-all">
          ← Volver a Directorio IA
        </Link>
      </div>
    );
  }

  return (
    <SoftwareArticleLayout
      category="ai"
      categoryLabel="IA & Modelos"
      categoryHref="/software/ai"
      title={resource.name}
      subtitle={resource.description}
      author={resource.provider}
      extraSidebarCard={
        <div className="p-6 rounded-3xl glass-convex-panel border border-white/5 space-y-4 shadow-xl">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 pb-2 border-b border-white/5">
            Ficha Técnica de IA
          </h5>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Proveedor:</span>
              <span className="font-bold text-white">{resource.provider}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Tipo:</span>
              <span className="text-indigo-400 uppercase">{resource.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Licencia:</span>
              <span className="text-zinc-300">{resource.license}</span>
            </div>
          </div>

          {(resource.documentationUrl || resource.githubUrl || resource.paperUrl) && (
            <div className="pt-2 border-t border-white/5">
              <a
                href={resource.documentationUrl || resource.githubUrl || resource.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl glass-concave-panel text-xs font-mono font-bold text-center block text-indigo-400 hover:text-white transition-all shadow-sm"
              >
                Acceder al Modelo / API ↗
              </a>
            </div>
          )}
        </div>
      }
    >
      <MarkdownRenderer content={resource.contentMarkdown} />
    </SoftwareArticleLayout>
  );
}
