'use client';

import React, { useState } from 'react';
import {
  HebrewLexiconEntry,
  GreekLexiconEntry,
  HebrewLexiconSource,
  GreekLexiconSource,
} from '../types';

interface LexiconEntryDetailProps {
  entry: HebrewLexiconEntry | GreekLexiconEntry | null;
  type: 'hebrew' | 'greek';
}

export const LexiconEntryDetail: React.FC<LexiconEntryDetailProps> = ({
  entry,
  type,
}) => {
  const [hebrewSource, setHebrewSource] = useState<HebrewLexiconSource>('BDB');
  const [greekSource, setGreekSource] = useState<GreekLexiconSource>('Thayer');

  if (!entry) {
    return (
      <div className="p-12 text-center rounded-2xl border border-accents-2 bg-accents-1/30 space-y-2">
        <div className="text-sm font-semibold text-foreground">
          {type === 'hebrew' ? 'Diccionario Hebreo & Arameo' : 'Léxico Griego Koiné'}
        </div>
        <p className="text-xs text-accents-4 max-w-md mx-auto">
          Selecciona una raíz del índice o busca un vocablo teológico para consultar las definiciones exegéticas de BDB, Gesenius, Thayer y LSJ.
        </p>
      </div>
    );
  }

  if (type === 'hebrew') {
    const heb = entry as HebrewLexiconEntry;

    return (
      <div className="space-y-6 animate-in fade-in duration-150">
        {/* Cabecera del Vocablo Hebreo / Arameo */}
        <div className="p-6 rounded-2xl border border-accents-2 bg-accents-1/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-baseline gap-4">
              <div
                dir="rtl"
                lang="he"
                className="text-4xl font-serif font-bold text-foreground"
                style={{ fontFamily: '"SBL Hebrew", "Ezra SIL", serif' }}
              >
                {heb.lemma}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-base font-mono font-bold text-foreground">
                    Raíz: {heb.root} ({heb.rootTransliteration})
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-foreground text-background font-bold">
                    {heb.strongPrimary}
                  </span>
                </div>
                <p className="text-xs text-accents-5">
                  {heb.language} • {heb.partOfSpeech} • {heb.occurrences} ocurrencias en el Tanaj
                </p>
              </div>
            </div>

            {/* Selector de Fuente Léxica Hebrea */}
            <div className="inline-flex rounded-lg border border-accents-2 bg-background p-1 text-xs">
              <button
                type="button"
                onClick={() => setHebrewSource('BDB')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  hebrewSource === 'BDB'
                    ? 'bg-foreground text-background font-bold shadow-xs'
                    : 'text-accents-4 hover:text-foreground'
                }`}
              >
                Brown-Driver-Briggs (BDB)
              </button>
              <button
                type="button"
                onClick={() => setHebrewSource('Gesenius')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  hebrewSource === 'Gesenius'
                    ? 'bg-foreground text-background font-bold shadow-xs'
                    : 'text-accents-4 hover:text-foreground'
                }`}
              >
                Gesenius
              </button>
              <button
                type="button"
                onClick={() => setHebrewSource('DTAT')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  hebrewSource === 'DTAT'
                    ? 'bg-foreground text-background font-bold shadow-xs'
                    : 'text-accents-4 hover:text-foreground'
                }`}
              >
                Teológico (DTAT)
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-background border border-accents-2 text-xs">
            <span className="font-mono text-[10px] uppercase font-bold text-accents-4 block mb-1">
              Glosa y Definición Principal:
            </span>
            <p className="text-sm font-semibold text-foreground leading-relaxed">
              «{heb.gloss}»
            </p>
          </div>

          {/* Cognados Semíticos */}
          {heb.cognates && heb.cognates.length > 0 && (
            <div className="text-xs text-accents-4 space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-accents-5">
                Cognados Semíticos Comparativos:
              </span>
              <div className="flex flex-wrap gap-2">
                {heb.cognates.map((cog, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-background border border-accents-2 text-[11px] font-mono text-accents-5"
                  >
                    {cog}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contenido del Léxico Seleccionado */}
        <div className="p-6 rounded-2xl border border-accents-2 bg-background space-y-4 shadow-xs">
          {hebrewSource === 'BDB' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-accents-2 pb-2">
                <span className="text-xs font-mono uppercase font-bold text-foreground">
                  Brown-Driver-Briggs Hebrew and English Lexicon (BDB)
                </span>
                <span className="text-[11px] font-mono text-accents-4">
                  Indexado por Raíz Semítica
                </span>
              </div>

              <p className="text-xs text-accents-5 italic leading-relaxed">
                {heb.bdb.rootEtymology}
              </p>

              <div className="space-y-3 pt-2">
                {heb.bdb.sections.map((sec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-accents-1/50 border border-accents-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-foreground text-background">
                        Acepción {sec.number}
                      </span>
                      {sec.stem && (
                        <span className="text-xs font-mono font-bold text-amber-500">
                          [{sec.stem}]
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                      {sec.definition}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sec.biblicalRefs.map((ref, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-background border border-accents-2 text-accents-4"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hebrewSource === 'Gesenius' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-accents-2 pb-2">
                <span className="text-xs font-mono uppercase font-bold text-foreground">
                  Gesenius' Hebrew and Chaldee Lexicon to the Old Testament
                </span>
                <span className="text-[11px] font-mono text-accents-4">
                  Filología Comparada
                </span>
              </div>

              <div className="p-4 rounded-xl bg-accents-1/40 border border-accents-2 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-accents-4">
                  Notas Filológicas y Etimológicas:
                </span>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {heb.gesenius.philologicalNotes}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-accents-1/40 border border-accents-2 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-accents-4">
                  Discusión de Derivación:
                </span>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {heb.gesenius.derivationDiscussion}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-accents-4">
                  Formas Gramaticales Documentadas:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {heb.gesenius.grammaticalForms.map((form, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-2 rounded-lg bg-background border border-accents-2 text-xs font-mono text-foreground"
                    >
                      {form}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hebrewSource === 'DTAT' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-accents-2 pb-2">
                <span className="text-xs font-mono uppercase font-bold text-foreground">
                  Diccionario Teológico del Antiguo Testamento (DTAT)
                </span>
                <span className="text-[11px] font-mono text-accents-4">
                  Teología Bíblica
                </span>
              </div>

              <div className="p-4 rounded-xl bg-accents-1/40 border border-accents-2 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-accents-4">
                  Concepto Teológico Primario:
                </span>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {heb.dtat.theologicalConcept}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-accents-1/40 border border-accents-2 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-accents-4">
                  Desarrollo en la Historia del Pacto:
                </span>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {heb.dtat.covenantContext}
                </p>
              </div>

              {heb.dtat.messianicTypology && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-500 block">
                    Tipología Mesiánica y Cumplimiento Neotestamentario:
                  </span>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                    {heb.dtat.messianicTypology}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Familia de Palabras y Vocablos Derivados */}
        <div className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs">
          <span className="text-xs font-mono uppercase font-bold text-foreground block">
            Familia de Palabras Derivadas ({heb.derivedWords.length}):
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {heb.derivedWords.map((word) => (
              <div key={word.strong} className="p-3 rounded-xl bg-accents-1/30 border border-accents-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    dir="rtl"
                    lang="he"
                    className="text-lg font-serif font-bold text-foreground"
                    style={{ fontFamily: '"SBL Hebrew", "Ezra SIL", serif' }}
                  >
                    {word.wordHebrew}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-accents-2 font-bold text-foreground">
                    {word.strong}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-accents-5">/{word.transliteration}/</span>
                  <span className="text-accents-4 text-[11px]">{word.partOfSpeech}</span>
                </div>
                <p className="text-xs text-foreground font-medium pt-1">
                  {word.gloss}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FICHA DE LÉXICO GRIEGO
  // =========================================================================
  const grk = entry as GreekLexiconEntry;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Cabecera del Vocablo Griego */}
      <div className="p-6 rounded-2xl border border-accents-2 bg-accents-1/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <div
              lang="el"
              className="text-4xl font-serif font-bold text-foreground"
              style={{ fontFamily: '"Gentium Plus", "SBL Greek", serif' }}
            >
              {grk.lemma}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-base font-mono font-bold text-foreground">
                  /{grk.transliteration}/
                </span>
                <span className="text-xs font-mono text-accents-4">{grk.ipa}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-foreground text-background font-bold">
                  {grk.strong}
                </span>
              </div>
              <p className="text-xs text-accents-5">
                {grk.partOfSpeech} • {grk.occurrences} ocurrencias en el NT • {grk.rootOrOrigin}
              </p>
            </div>
          </div>

          {/* Selector de Fuente Léxica Griega */}
          <div className="inline-flex flex-wrap rounded-lg border border-accents-2 bg-background p-1 text-xs">
            <button
              type="button"
              onClick={() => setGreekSource('Thayer')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                greekSource === 'Thayer'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              Thayer
            </button>
            <button
              type="button"
              onClick={() => setGreekSource('LSJ')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                greekSource === 'LSJ'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              LSJ Condensado
            </button>
            <button
              type="button"
              onClick={() => setGreekSource('Robertson')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                greekSource === 'Robertson'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              A.T. Robertson
            </button>
            <button
              type="button"
              onClick={() => setGreekSource('Vincent')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                greekSource === 'Vincent'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              Vincent
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-background border border-accents-2 text-xs">
          <span className="font-mono text-[10px] uppercase font-bold text-accents-4 block mb-1">
            Glosa y Definición Principal:
          </span>
          <p className="text-sm font-semibold text-foreground leading-relaxed">
            «{grk.gloss}»
          </p>
        </div>
      </div>

      {/* Detalle de la Fuente Léxica Griega Seleccionada */}
      <div className="p-6 rounded-2xl border border-accents-2 bg-background space-y-4 shadow-xs">
        {greekSource === 'Thayer' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-accents-2 pb-2">
              <span className="text-xs font-mono uppercase font-bold text-foreground">
                Thayer's Greek-English Lexicon of the New Testament
              </span>
              <span className="text-[11px] font-mono text-accents-4">
                Exégesis de Acepciones
              </span>
            </div>

            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {grk.thayer.primaryMeaning}
            </p>

            <div className="space-y-3 pt-2">
              {grk.thayer.senses.map((sense, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-accents-1/50 border border-accents-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-foreground text-background">
                      {sense.number}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {sense.heading}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-accents-5 leading-relaxed">
                    {sense.details}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sense.biblicalRefs.map((ref, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-background border border-accents-2 text-accents-4"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {grk.thayer.prepositionalUsage && (
              <div className="p-3.5 rounded-xl bg-accents-1/30 border border-accents-2 text-xs space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-accents-4">
                  Régimen Preposicional y Sintáctico:
                </span>
                <p className="text-foreground">{grk.thayer.prepositionalUsage}</p>
              </div>
            )}
          </div>
        )}

        {greekSource === 'LSJ' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-accents-2 pb-2">
              <span className="text-xs font-mono uppercase font-bold text-foreground">
                Liddell-Scott-Jones Greek-English Lexicon (LSJ Condensado)
              </span>
              <span className="text-[11px] font-mono text-accents-4">
                Griego Clásico, Septuaginta y Papiros
              </span>
            </div>

            <div className="p-4 rounded-xl bg-accents-1/40 border border-accents-2 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-accents-4">
                Uso en la Literatura y Filosofía Griega Clásica:
              </span>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {grk.lsj.classicalUsage}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-accents-1/40 border border-accents-2 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-accents-4">
                Uso en la Septuaginta (LXX):
              </span>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {grk.lsj.septuagintUsage}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-accents-1/40 border border-accents-2 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-accents-4">
                Evidencia en Papiros e Inscripciones del Siglo I:
              </span>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {grk.lsj.papyriContext}
              </p>
            </div>
          </div>
        )}

        {greekSource === 'Robertson' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-accents-2 pb-2">
              <span className="text-xs font-mono uppercase font-bold text-foreground">
                Robertson's Word Pictures in the New Testament (A.T. Robertson)
              </span>
              <span className="text-[11px] font-mono text-accents-4">
                Exégesis Gramatical y Tiempos Verbales
              </span>
            </div>

            <div className="space-y-3">
              {grk.robertson.keyPassages.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-accents-1/40 border border-accents-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-foreground">
                      {item.verseRef}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-mono text-[10px] uppercase font-bold text-accents-4 block">
                      Análisis Sintáctico y Gramatical:
                    </span>
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed font-serif">
                      {item.grammaticalExegesis}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-accents-2/60 text-xs text-accents-5">
                    <span className="font-mono text-[10px] uppercase font-bold text-accents-4 block">
                      Trasfondo Histórico y Teológico:
                    </span>
                    <p className="leading-relaxed">{item.historicalInsight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {greekSource === 'Vincent' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-accents-2 pb-2">
              <span className="text-xs font-mono uppercase font-bold text-foreground">
                Vincent's Word Studies in the New Testament (Marvin Vincent)
              </span>
              <span className="text-[11px] font-mono text-accents-4">
                Imaginería y Fuerza Pictórica
              </span>
            </div>

            <div className="space-y-3">
              {grk.vincent.wordStudies.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-accents-1/40 border border-accents-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-foreground">
                      {item.verseRef}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-mono text-[10px] uppercase font-bold text-accents-4 block">
                      Metáfora Pictórica y Fuerza Visual Original:
                    </span>
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed font-serif">
                      {item.pictorialMetaphor}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-accents-2/60 text-xs text-accents-5">
                    <span className="font-mono text-[10px] uppercase font-bold text-accents-4 block">
                      Contexto Cultural Greco-Romano:
                    </span>
                    <p className="leading-relaxed">{item.culturalContext}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
