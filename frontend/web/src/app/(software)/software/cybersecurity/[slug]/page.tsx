'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { SecurityPost } from '../../../features/cybersecurity/types';
import { API_URL } from '../../../../config';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';

export default function SecurityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const [post, setPost] = useState<SecurityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/software/cybersecurity/${slug}?lang=${locale}`);
        if (!res.ok) throw new Error('Aviso no encontrado');
        const data = await res.json();
        setPost(data.data || data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar aviso');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex justify-center items-center bg-[var(--background)]">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-xs font-mono">
          Cargando análisis de seguridad...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col justify-center items-center gap-4 bg-[var(--background)]">
        <p className="text-rose-500 font-mono text-sm">{error || 'Aviso no encontrado'}</p>
        <Link href="/software/cybersecurity" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-rose-400 hover:text-white transition-all">
          ← Volver a Ciberseguridad
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SoftwareArticleLayout
      category="cybersecurity"
      categoryLabel="Ciberseguridad"
      categoryHref="/software/cybersecurity"
      title={post.title}
      subtitle={post.excerpt}
      date={formattedDate}
      author="Jorge Doicela"
      callout={
        post.remediation ? (
          <div className="p-5 rounded-2xl bg-cyan-950/20 border-l-4 border-cyan-400 space-y-1.5 shadow-sm">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Remediación & Mitigación Recomendada
            </h4>
            <p className="text-xs sm:text-sm text-cyan-200/90 font-light leading-relaxed">
              {post.remediation}
            </p>
          </div>
        ) : undefined
      }
      extraSidebarCard={
        <div className="p-6 rounded-3xl glass-convex-panel border border-white/5 space-y-4 shadow-xl">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 pb-2 border-b border-white/5">
            Ficha del Aviso CVE
          </h5>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Severidad:</span>
              <span className="font-bold text-rose-400">{post.severity}</span>
            </div>
            {post.cveId && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">CVE ID:</span>
                <span className="font-bold text-cyan-400">{post.cveId}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Tipo:</span>
              <span className="text-zinc-300">{post.postType}</span>
            </div>
            {post.affectedSystems && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Sistemas:</span>
                <span className="text-zinc-300 truncate max-w-[140px] text-right">{post.affectedSystems}</span>
              </div>
            )}
          </div>
          <div className="pt-2 border-t border-white/5">
            <Link
              href="/software/cybersecurity"
              className="w-full py-2 rounded-xl glass-concave-panel text-xs font-mono font-bold text-center block text-rose-400 hover:text-white transition-all"
            >
              ← Todos los avisos
            </Link>
          </div>
        </div>
      }
    >
      <MarkdownRenderer content={post.contentMarkdown} />
    </SoftwareArticleLayout>
  );
}
