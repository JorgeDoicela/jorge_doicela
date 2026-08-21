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
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm">
          Cargando tutorial interactivo...
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-400 font-semibold">{error || 'Tutorial no encontrado'}</p>
        <Link href="/software" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs">
          ← Volver al Hub
        </Link>
      </div>
    );
  }

  const steps = tutorial.steps || [];
  const currentStep = steps[activeStep];

  return (
    <article className="min-h-screen py-16 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
      <Link
        href="/software"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        ← Volver al Software Hub
      </Link>

      <header className="p-8 md:p-12 rounded-3xl glass-convex-panel">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {tutorial.difficulty}
          </span>
          <span className="text-xs text-zinc-500 font-mono">{tutorial.estimatedMinutes} min</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-[var(--foreground)] mb-3 leading-tight">
          {tutorial.title}
        </h1>

        <p className="text-base text-zinc-300 font-light leading-relaxed mb-6">
          {tutorial.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 border-t border-white/5 pt-4">
          <span>Stack: <strong className="text-zinc-200">{tutorial.techStack}</strong></span>
          {tutorial.prerequisites && <span>• Requisitos: {tutorial.prerequisites}</span>}
        </div>
      </header>

      {/* Wizard de Pasos */}
      {steps.length > 0 && (
        <div className="space-y-6">
          {/* Navegador de Pasos */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'glass-btn-neumorphic text-amber-400 scale-[1.02]'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>Paso {idx + 1}</span>
              </button>
            ))}
          </div>

          {/* Contenido del Paso Activo */}
          {currentStep && (
            <div className="p-8 md:p-12 rounded-3xl glass-convex-panel space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  Paso {activeStep + 1}: {currentStep.title}
                </h2>
                <span className="text-xs font-mono text-zinc-500">
                  {activeStep + 1} de {steps.length}
                </span>
              </div>

              <div className="text-sm md:text-base text-zinc-300 font-light leading-relaxed whitespace-pre-line">
                {currentStep.contentMarkdown}
              </div>

              {currentStep.codeSnippet && (
                <div className="rounded-2xl bg-zinc-950 p-5 font-mono text-xs text-emerald-400 overflow-x-auto border border-white/5 shadow-inner">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase pb-2 mb-2 border-b border-zinc-800">
                    <span>{currentStep.codeLanguage}</span>
                    <span>Snippet de código</span>
                  </div>
                  <pre className="whitespace-pre">{currentStep.codeSnippet}</pre>
                </div>
              )}

              {/* Botones de Anterior / Siguiente */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-semibold disabled:opacity-30 cursor-pointer"
                >
                  ← Paso Anterior
                </button>

                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-bold text-amber-400 hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                >
                  Siguiente Paso →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
