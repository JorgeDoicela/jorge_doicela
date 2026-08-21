'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ForumTopic, ForumReply } from '../../../features/forum/types';
import { API_URL } from '../../../../config';

export default function ForumTopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopic = async () => {
    try {
      const res = await fetch(`${API_URL}/software/forum/${slug}`);
      if (!res.ok) throw new Error('Tema no encontrado');
      const data = await res.json();
      setTopic(data.data || data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tema');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, [slug]);

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
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm">
          Cargando debate...
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-400 font-semibold">{error || 'Tema no encontrado'}</p>
        <Link href="/software" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs">
          ← Volver al Hub
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
    <div className="min-h-screen py-16 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
      <Link
        href="/software"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        ← Volver al Software Hub
      </Link>

      {/* Tema Principal */}
      <div className="p-8 md:p-12 rounded-3xl glass-convex-panel">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {topic.category}
          </span>
          {topic.isSolved && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Resuelto
            </span>
          )}
          <span className="text-xs text-zinc-500">• {formattedDate}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-4 leading-snug">
          {topic.title}
        </h1>

        <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed whitespace-pre-line mb-6">
          {topic.content}
        </p>

        <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-4">
          <span>Iniciado por {topic.author}</span>
          <span>{topic.repliesCount} respuestas</span>
          <span>{topic.views} vistas</span>
        </div>
      </div>

      {/* Hilo de Respuestas */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[var(--foreground)]">
          Respuestas ({topic.replies?.length || 0})
        </h3>

        {(!topic.replies || topic.replies.length === 0) ? (
          <div className="p-8 rounded-3xl glass-concave-panel text-center text-zinc-500 text-sm">
            Sé el primero en responder a este debate.
          </div>
        ) : (
          topic.replies.map((reply: ForumReply) => (
            <div
              key={reply.id}
              className={`p-6 rounded-3xl ${
                reply.isAcceptedAnswer
                  ? 'glass-convex-panel border border-emerald-500/30 bg-emerald-950/10'
                  : 'glass-convex-panel'
              } space-y-3`}
            >
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-indigo-400">{reply.author}</span>
                  {reply.isAcceptedAnswer && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                      Respuesta Aceptada
                    </span>
                  )}
                </div>
                <span className="font-mono text-zinc-500">
                  {new Date(reply.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>

              <p className="text-sm text-zinc-300 font-light leading-relaxed whitespace-pre-line">
                {reply.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Formulario de Respuesta */}
      <form onSubmit={handlePostReply} className="p-8 rounded-3xl glass-convex-panel space-y-4">
        <h4 className="text-base font-bold text-[var(--foreground)]">Añadir una respuesta</h4>

        <div>
          <input
            type="text"
            placeholder="Tu nombre o alias (opcional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <textarea
            required
            rows={4}
            placeholder="Escribe tu contribución técnica o solución..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-xl glass-btn-neumorphic text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? 'Publicando...' : 'Publicar Respuesta'}
        </button>
      </form>
    </div>
  );
}
