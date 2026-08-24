'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Tutorial } from '../../../features/tutorials/types';
import { API_URL } from '../../../../config';

export default function TutorialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const res = await fetch(`${API_URL}/software/tutorials/${slug}`);
        if (!res.ok) throw new Error('Tutorial no encontrado');
        const data = await res.json();
        setTutorial(data.data || data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar tutorial');
      } finally {
        setLoading(false);
      }
    };
    fetchTutorial();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex justify-center items-center">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm font-mono">
          Cargando tutorial interactivo...
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-500 font-semibold">{error || 'Tutorial no encontrado'}</p>
        <Link href="/software/tutorials" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-mono">
          ← Volver a Tutoriales
        </Link>
      </div>
    );
  }

  const steps = tutorial.steps || [];
  const currentStep = steps[activeStep];

  return (
    <article className="min-h-screen py-10 md:py-14 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-7xl 2xl:max-w-[1500px] mx-auto space-y-8">
      {/* Breadcrumb de navegación */}
      <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
        <Link href="/software" className="hover:text-[var(--foreground)] transition-colors">
          Software
        </Link>
        <span>/</span>
        <Link href="/software/tutorials" className="hover:text-[var(--foreground)] transition-colors">
          Tutoriales
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] truncate max-w-xs">{tutorial.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal de Pasos (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <header className="p-8 md:p-12 rounded-3xl glass-convex-panel">
            <div className="flex items-center gap-3 mb-4 text-xs font-mono">
              <span className="font-bold uppercase text-slate-600 dark:text-slate-300">
                Nivel: {tutorial.difficulty}
              </span>
              <span className="text-zinc-500">• {tutorial.estimatedMinutes} min estimados</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--header-title)] mb-4 leading-[1.15]">
              {tutorial.title}
            </h1>

            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">
              {tutorial.description}
            </p>
          </header>

          {/* Wizard del Paso Activo */}
          {currentStep && (
            <div className="p-8 md:p-12 rounded-3xl glass-convex-panel space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
                <h2 className="text-xl font-bold text-[var(--header-title)]">
                  Paso {activeStep + 1}: {currentStep.title}
                </h2>
                <span className="text-xs font-mono text-zinc-500">
                  {activeStep + 1} de {steps.length}
                </span>
              </div>

              <div className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 font-light leading-relaxed whitespace-pre-line">
                {currentStep.contentMarkdown}
              </div>

              {currentStep.codeSnippet && (
                <div className="rounded-2xl bg-zinc-950 p-5 font-mono text-xs text-cyan-400 overflow-x-auto border border-white/5 shadow-inner">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase pb-2 mb-2 border-b border-zinc-800">
                    <span>{currentStep.codeLanguage}</span>
                    <span>Snippet de código</span>
                  </div>
                  <pre className="whitespace-pre">{currentStep.codeSnippet}</pre>
                </div>
              )}

              {/* Botones de Navegación del Paso */}
              <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-mono font-semibold disabled:opacity-30 cursor-pointer"
                >
                  ← Paso Anterior
                </button>

                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-mono font-bold text-blue-600 dark:text-blue-400 disabled:opacity-30 cursor-pointer"
                >
                  Siguiente Paso →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Columna Lateral / Ficha & Navegador de Pasos (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl glass-convex-panel space-y-4 sticky top-20">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 pb-2 border-b border-black/5 dark:border-white/5">
              Navegador de Pasos
            </h3>

            <div className="space-y-2">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full p-3 rounded-2xl text-left text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                    activeStep === idx
                      ? 'glass-concave-panel text-blue-600 dark:text-blue-400 font-bold border-blue-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--foreground)]'
                  }`}
                >
                  <span className="truncate pr-2">Paso {idx + 1}: {s.title}</span>
                  {activeStep === idx && <span>●</span>}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2 text-xs font-mono">
              <div className="text-zinc-500">Stack: <strong className="text-[var(--foreground)]">{tutorial.techStack}</strong></div>
              {tutorial.prerequisites && (
                <div className="text-zinc-500">Requisitos: <strong className="text-[var(--foreground)]">{tutorial.prerequisites}</strong></div>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/software/tutorials"
                className="w-full py-2.5 rounded-2xl glass-concave-panel text-xs font-mono font-bold text-center block text-blue-600 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                ← Ver Todos los Tutoriales
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
