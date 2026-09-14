'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Shield, BookOpen, MessageSquare, Sparkles, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useBiblePassageSafe } from '../context/BiblePassageContext';
import { getBookHistoricalInfo } from '../features/books/data/bookHistoricalMetadata';

interface KeyDoctrine {
  term: string;
  originalGreek: string;
  definition: string;
  reference: string;
}

const KEY_DOCTRINES: KeyDoctrine[] = [
  {
    term: 'Justificación',
    originalGreek: 'dikaiōsis (δικαίωσις)',
    definition:
      'Veredicto judicial soberano donde Dios declara justo al pecador culpable, imputándole la justicia perfecta de Cristo mediante la fe.',
    reference: 'Romanos 3:24, Romanos 5:1',
  },
  {
    term: 'Propiciación',
    originalGreek: 'hilasmos (ἱλασμός)',
    definition:
      'Sacrificio sustitutivo que satisface y aplaca por completo la santa y justa ira de Dios contra el pecado en la cruz.',
    reference: '1 Juan 2:2, Romanos 3:25',
  },
  {
    term: 'Gracia',
    originalGreek: 'charis (χάρις)',
    definition:
      'El favor y la dádiva infinita de Dios otorgada libre e inmerecidamente a rebeldes que solo merecían condenación.',
    reference: 'Efesios 2:8-9, Tito 2:11',
  },
  {
    term: 'Fe Salvífica',
    originalGreek: 'pistis (πίστις)',
    definition:
      'Confianza y rendición total del alma en Jesucristo como único Salvador y Señor, descansando en Su obra consumada.',
    reference: 'Romanos 10:9-10, Hebreos 11:1',
  },
  {
    term: 'Regeneración',
    originalGreek: 'palingenesia (παλιγγενεσία)',
    definition:
      'La resurrección espiritual interna operada exclusivamente por el Espíritu Santo, otorgando un corazón nuevo vivo para Dios.',
    reference: 'Tito 3:5, Juan 3:3-5',
  },
];

export const EvangelismApologeticsProfile: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const tBooks = useTranslations('Books');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const selectedBook = passageContext?.selectedBook;
  const bookId = passageContext?.selectedBookId ?? 45; // Romanos por defecto
  const chapter = passageContext?.selectedChapter ?? 1;

  const info = getBookHistoricalInfo(bookId);

  const localizedBookTitle = selectedBook?.abbreviation
    ? (tBooks.has(selectedBook.abbreviation as any) ? tBooks(selectedBook.abbreviation as any) : selectedBook.name)
    : (selectedBook?.name || 'Romanos');

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Tarjeta de Principio Ministerial */}
      <div className="p-3.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/60 backdrop-blur-xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Apologética Bíblica Fiel (1 Pe 3:15)</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          «Estad siempre preparados para presentar defensa con mansedumbre y reverencia ante todo el que os demande razón de la esperanza que hay en vosotros.»
        </p>
      </div>

      {/* Relevancia del Libro Bíblico Activo */}
      {info && (
        <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {localizedBookTitle} en la Evangelización
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Cap. {chapter}</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {info.practicalMinisterialFocus || info.theologicalTheme}
          </p>
        </div>
      )}

      {/* Vocablos Teológicos Clave para no descontextualizar el Evangelio */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Glosario Soteriológico Fundamental</span>
        </div>

        <div className="space-y-1.5">
          {KEY_DOCTRINES.map((doc, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={doc.term}
                className="rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-black/70 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-2.5 text-left flex items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {doc.term}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        ({doc.originalGreek})
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-2.5 pb-2.5 pt-0 text-xs space-y-1 border-t border-zinc-100 dark:border-zinc-800/60 mt-1">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1.5">
                      {doc.definition}
                    </p>
                    <span className="inline-block text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Citas: {doc.reference}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Consejos Prácticos de Diálogo */}
      <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
          <span>Consejo Pastoral para Dialogar</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Evita ganar discusiones y enfócate en ganar personas para Cristo. Responde siempre con la Escritura, no con opiniones personales; la Palabra es viva y eficaz.
        </p>
      </div>

      {/* Enlace al Lector */}
      <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <Link
          href={`/study/standard?book=${selectedBook?.abbreviation || 'ROM'}&chapter=${chapter}`}
          className="w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors flex items-center justify-between group"
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Leer {localizedBookTitle} {chapter} en el Lector</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
