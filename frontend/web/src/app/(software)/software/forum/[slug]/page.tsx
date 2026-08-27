'use client';

import { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ForumTopic, ForumReply } from '../../../features/forum/types';
import { API_URL } from '../../../../config';

export default function ForumTopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopic = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/software/forum/${slug}?lang=${locale}`);
      if (!res.ok) throw new Error('Tema no encontrado');
      const data = await res.json();
      setTopic(data.data || data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tema');
    } finally {
      setLoading(false);
    }
  }, [slug, locale]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !topic) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/software/forum/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic.id,
          content: replyContent.trim(),
          author: authorName.trim() || 'Desarrollador Anónimo',
        }),
      });

      if (!res.ok) throw new Error('Error al enviar respuesta');
      setReplyContent('');
      await fetchTopic();
    } catch (err: any) {
      alert(err.message || 'Error al publicar');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex justify-center items-center">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm font-mono">
          Cargando debate...
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-500 font-semibold">{error || 'Tema no encontrado'}</p>
        <Link href="/software/forum" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-mono">
          ← Volver al Foro
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(topic.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen py-10 md:py-14 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-7xl 2xl:max-w-[1500px] mx-auto space-y-8">
      {/* Breadcrumb de navegación */}
      <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
        <Link href="/software" className="hover:text-[var(--foreground)] transition-colors">
          Software
        </Link>
        <span>/</span>
        <Link href="/software/forum" className="hover:text-[var(--foreground)] transition-colors">
          Foros & Debates
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] truncate max-w-xs">{topic.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal: Debate y Respuestas (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tema Principal */}
          <div className="p-8 md:p-12 rounded-3xl glass-convex-panel">
            <div className="flex items-center gap-3 mb-4 text-xs font-mono">
              <span className="font-bold uppercase text-blue-600 dark:text-blue-400">
                {topic.category}
              </span>
              {topic.isSolved && (
                <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  ● Resuelto
                </span>
              )}
              <span className="text-zinc-500">• {formattedDate}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[var(--header-title)] mb-4 leading-snug">
              {topic.title}
            </h1>

            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 font-light leading-relaxed whitespace-pre-line">
              {topic.content}
            </p>
          </div>

          {/* Hilo de Respuestas */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--header-title)] font-mono">
              Respuestas ({topic.replies?.length || 0})
            </h3>

            {(!topic.replies || topic.replies.length === 0) ? (
              <div className="p-8 rounded-3xl glass-concave-panel text-center text-zinc-500 text-sm font-mono">
                Sé el primero en aportar una respuesta a este debate.
              </div>
            ) : (
              topic.replies.map((reply: ForumReply) => (
                <div
                  key={reply.id}
                  className={`p-6 rounded-3xl ${
                    reply.isAcceptedAnswer
                      ? 'glass-convex-panel border border-emerald-500/30'
                      : 'glass-convex-panel'
                  } space-y-3`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{reply.author}</span>
                      {reply.isAcceptedAnswer && (
                        <span className="text-emerald-500 font-bold">
                          ✓ Respuesta Aceptada
                        </span>
                      )}
                    </div>
                    <span className="text-zinc-500">
                      {new Date(reply.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-700 dark:text-zinc-300 font-light leading-relaxed whitespace-pre-line">
                    {reply.content}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Formulario de Respuesta */}
          <form onSubmit={handlePostReply} className="p-8 rounded-3xl glass-convex-panel space-y-4">
            <h4 className="text-base font-bold text-[var(--header-title)] font-mono">Añadir una respuesta</h4>

            <div>
              <input
                type="text"
                placeholder="Tu nombre o alias (opcional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <textarea
                required
                rows={4}
                placeholder="Escribe tu contribución técnica o solución..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed font-light"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl glass-btn-neumorphic text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:text-white disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Publicando...' : 'Publicar Respuesta'}
            </button>
          </form>
        </div>

        {/* Columna Lateral: Ficha del Debate (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl glass-convex-panel space-y-4 sticky top-20">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 pb-2 border-b border-black/5 dark:border-white/5">
              Estado del Debate
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Iniciado por:</span>
                <span className="font-bold text-[var(--foreground)]">{topic.author}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Categoría:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{topic.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Respuestas:</span>
                <span className="font-bold text-[var(--foreground)]">{topic.repliesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Vistas:</span>
                <span className="text-[var(--foreground)]">{topic.views}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <Link
                href="/software/forum"
                className="w-full py-2.5 rounded-2xl glass-concave-panel text-xs font-mono font-bold text-center block text-blue-600 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                ← Ver Todos los Debates
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
