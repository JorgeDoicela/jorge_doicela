'use client';

import { useState, useMemo } from 'react';
import { ConcordanceVerseResult, ConcordanceSearchStats } from '../types';
import { CONCORDANCE_DATASET } from '../data/morphology-database';

export function useConcordance() {
  const [query, setQuery] = useState<string>('Verbo AND Dios');
  const [selectedTranslation, setSelectedTranslation] = useState<string>('all');

  const { results, stats } = useMemo(() => {
    const startTime = typeof performance !== 'undefined' ? performance.now() : 0;
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return {
        results: [],
        stats: {
          totalResults: 0,
          executionTimeMs: 0,
          parsedTokens: [],
          operatorsUsed: [],
          queriedTranslation: selectedTranslation,
        },
      };
    }

    const operatorsFound: string[] = [];
    if (cleanQuery.includes(' AND ')) operatorsFound.push('AND');
    if (cleanQuery.includes(' OR ')) operatorsFound.push('OR');
    if (cleanQuery.includes(' NOT ')) operatorsFound.push('NOT');
    if (cleanQuery.includes('"')) operatorsFound.push('PHRASE');
    if (cleanQuery.includes('*')) operatorsFound.push('WILDCARD');
    if (/NEAR\/\d+/i.test(cleanQuery)) operatorsFound.push('NEAR');

    // Extraer frases entre comillas
    const phrases: string[] = [];
    const phraseRegex = /"([^"]+)"/g;
    let match;
    while ((match = phraseRegex.exec(cleanQuery)) !== null) {
      phrases.push(match[1]);
    }

    // Limpiar la query de frases para extraer tokens individuales
    const rawWithoutPhrases = cleanQuery.replace(phraseRegex, '');
    const tokens = rawWithoutPhrases
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t && !['AND', 'OR', 'NOT'].includes(t.toUpperCase()) && !t.startsWith('NEAR/'));

    const allSearchTerms = [...phrases, ...tokens];

    const filtered = CONCORDANCE_DATASET.filter((item) => {
      if (
        selectedTranslation !== 'all' &&
        item.translationAbbr !== selectedTranslation
      ) {
        return false;
      }

      const textLower = item.text.toLowerCase();

      // Evaluar frases exactas
      for (const p of phrases) {
        if (!textLower.includes(p.toLowerCase())) {
          return false;
        }
      }

      // Evaluar lógica booleana con operadores
      if (cleanQuery.includes(' NOT ')) {
        const notParts = cleanQuery.split(/\s+NOT\s+/i);
        if (notParts.length > 1) {
          const forbiddenTerm = notParts[1].replace(/["*]/g, '').trim().toLowerCase();
          if (forbiddenTerm && textLower.includes(forbiddenTerm)) {
            return false;
          }
        }
      }

      if (cleanQuery.includes(' OR ')) {
        const orTerms = cleanQuery
          .split(/\s+OR\s+/i)
          .map((t) => t.replace(/["*]/g, '').trim().toLowerCase());
        const matchesAny = orTerms.some((t) => t && textLower.includes(t));
        if (!matchesAny) return false;
      } else {
        // Modo AND por defecto
        for (const token of tokens) {
          const isWildcard = token.endsWith('*');
          const cleanToken = token.replace('*', '').toLowerCase();

          if (isWildcard) {
            // Coincidencia por prefijo
            const words = textLower.split(/[\s,.;:!?¡¿()—"']+/);
            const matchesPrefix = words.some((w) => w.startsWith(cleanToken));
            if (!matchesPrefix) return false;
          } else {
            if (!textLower.includes(cleanToken)) {
              return false;
            }
          }
        }
      }

      return true;
    });

    const mappedResults: ConcordanceVerseResult[] = filtered.map((item) => {
      const matchedSpans: string[] = [];
      for (const term of allSearchTerms) {
        const cleanTerm = term.replace('*', '').toLowerCase();
        if (item.text.toLowerCase().includes(cleanTerm)) {
          matchedSpans.push(cleanTerm);
        }
      }
      return {
        ...item,
        matchedSpans,
      };
    });

    const endTime = typeof performance !== 'undefined' ? performance.now() : 0;
    const duration = Math.max(0.5, Number((endTime - startTime).toFixed(1)));

    const searchStats: ConcordanceSearchStats = {
      totalResults: mappedResults.length,
      executionTimeMs: duration,
      parsedTokens: allSearchTerms,
      operatorsUsed: operatorsFound,
      queriedTranslation: selectedTranslation,
    };

    return {
      results: mappedResults,
      stats: searchStats,
    };
  }, [query, selectedTranslation]);

  const insertOperatorSnippet = (snippet: string) => {
    setQuery((prev) => (prev ? `${prev.trim()} ${snippet}` : snippet));
  };

  return {
    query,
    setQuery,
    selectedTranslation,
    setSelectedTranslation,
    results,
    stats,
    insertOperatorSnippet,
  };
}
