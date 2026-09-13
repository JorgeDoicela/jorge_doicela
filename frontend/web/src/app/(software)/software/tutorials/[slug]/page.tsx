'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Tutorial } from '../../../features/tutorials/types';
import { API_URL } from '../../../../config';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';
import { CodeBlock } from '../../../components/markdown';

export default function TutorialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const tNav = useTranslations('Nav');
  const tTutorials = useTranslations('Tutorials');
  const tDetail = useTranslations('Detail');
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const res = await fetch(`${API_URL}/software/tutorials/${slug}?lang=${locale}`);
        if (!res.ok) throw new Error(tDetail('tutorialNotFound'));
        const data = await res.json();
        setTutorial(data.data || data);
      } catch (err: any) {
        setError(err.message || tDetail('tutorialNotFound'));
      } finally {
        setLoading(false);
      }
    };
    fetchTutorial();
  }, [slug, locale, tDetail]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex justify-center items-center bg-[var(--background)]">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-xs font-mono">
          {tDetail('loadingTutorial')}
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col justify-center items-center gap-4 bg-[var(--background)]">
        <p className="text-rose-500 font-mono text-sm">{error || tDetail('tutorialNotFound')}</p>
        <Link href="/tutorials" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all">
          {tTutorials('back')}
        </Link>
      </div>
    );
  }

  const steps = tutorial.steps || [];
  const currentStep = steps[activeStep];

  return (
    <SoftwareArticleLayout
      category="tutorials"
      categoryLabel={tNav('tutorials')}
      categoryHref="/tutorials"
      title={tutorial.title}
      subtitle={tutorial.description}
      author="Jorge Doicela"
    >
      {/* Wizard por pasos interactivo dentro del contenedor editorial unificado */}
      {currentStep ? (
        <div className="space-y-6">
          {/* Selector de Pasos en Pills Horizontales */}
          {steps.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 pb-1">
              {steps.map((st, idx) => (
                <button
                  key={st.id || idx}
                  onClick={() => setActiveStep(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeStep === idx
                      ? 'glass-concave-panel text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/30 shadow-xs'
                      : 'glass-convex-panel text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-black/5 dark:border-white/5'
                  }`}
                >
                  <span className="opacity-60 text-[10px]">0{idx + 1}.</span>
                  <span className="truncate max-w-[180px]">{st.title}</span>
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {tDetail('stepLabel', { step: activeStep + 1, title: currentStep.title })}
            </h3>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
              {tDetail('stepOf', { current: activeStep + 1, total: steps.length })}
            </span>
          </div>

          <MarkdownRenderer content={currentStep.contentMarkdown} />

          {currentStep.codeSnippet && (
            <CodeBlock
              code={currentStep.codeSnippet}
              language={currentStep.codeLanguage || 'bash'}
            />
          )}

          {/* Botones de Navegación entre pasos */}
          <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="px-4 py-2 rounded-xl glass-concave-panel text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              {tDetail('prevStep')}
            </button>
            <button
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStep === steps.length - 1}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-md hover:shadow-blue-500/25"
            >
              {tDetail('nextStep')}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-zinc-500 font-mono">{tDetail('noSteps')}</p>
      )}
    </SoftwareArticleLayout>
  );
}
