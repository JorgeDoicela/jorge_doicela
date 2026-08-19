import { DiffResult, DiffToken, TranslationApproachInfo } from '../types';

/**
 * Mapeo de filosofías de traducción bíblica conocidas
 */
export const TRANSLATION_APPROACHES: Record<string, TranslationApproachInfo> = {
  RV1960: {
    philosophy: 'Formal',
    description: 'Equivalencia Formal (literal y tradicional)',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  LBLA: {
    philosophy: 'Formal',
    description: 'Equivalencia Formal estricta de alta precisión exegética',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  KJV: {
    philosophy: 'Formal',
    description: 'Equivalencia Formal clásica sobre el Textus Receptus',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  NVI: {
    philosophy: 'Dinámica',
    description: 'Equivalencia Dinámica / Funcional contemporánea',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  JER: {
    philosophy: 'Crítica',
    description: 'Traducción exegética con aparato crítico y fidelidad poética',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  LXX: {
    philosophy: 'Histórica',
    description: 'Texto griego alejandrino de la Septuaginta (LXX)',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
};

/**
 * Tokeniza una cadena en palabras preservando espacios
 */
function tokenizeWords(text: string): string[] {
  if (!text) return [];
  // Divide por espacios en blanco preservando las palabras
  return text.trim().split(/\s+/);
}

/**
 * Normaliza una palabra para comparación insensible a signos de puntuación
 */
function cleanWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/[.,;:!?¡¿"«»()—[\]]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Algoritmo LCS (Longest Common Subsequence) para comparar dos listas de palabras
 */
export function computeWordDiff(textA: string, textB: string): DiffResult {
  const wordsA = tokenizeWords(textA);
  const wordsB = tokenizeWords(textB);

  const n = wordsA.length;
  const m = wordsB.length;

  if (n === 0 && m === 0) {
    return {
      tokensA: [],
      tokensB: [],
      inlineTokens: [],
      similarityPercentage: 100,
      wordCountA: 0,
      wordCountB: 0,
      differencesCount: 0,
    };
  }

  // Matriz DP de LCS
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0),
  );

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (cleanWord(wordsA[i - 1]) === cleanWord(wordsB[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Reconstrucción del diff
  let i = n;
  let j = m;

  const tokensA: DiffToken[] = [];
  const tokensB: DiffToken[] = [];
  const inlineTokens: DiffToken[] = [];

  let equalCount = 0;
  let diffCount = 0;

  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      cleanWord(wordsA[i - 1]) === cleanWord(wordsB[j - 1])
    ) {
      tokensA.unshift({ type: 'EQUAL', value: wordsA[i - 1] });
      tokensB.unshift({ type: 'EQUAL', value: wordsB[j - 1] });
      inlineTokens.unshift({ type: 'EQUAL', value: wordsA[i - 1] });
      equalCount++;
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tokensB.unshift({ type: 'ADDED', value: wordsB[j - 1] });
      inlineTokens.unshift({ type: 'ADDED', value: wordsB[j - 1] });
      diffCount++;
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      tokensA.unshift({ type: 'REMOVED', value: wordsA[i - 1] });
      inlineTokens.unshift({ type: 'REMOVED', value: wordsA[i - 1] });
      diffCount++;
      i--;
    }
  }

  const maxWords = Math.max(n, m);
  const similarityPercentage = maxWords > 0 ? Math.round((equalCount / maxWords) * 100) : 100;

  return {
    tokensA,
    tokensB,
    inlineTokens,
    similarityPercentage,
    wordCountA: n,
    wordCountB: m,
    differencesCount: diffCount,
  };
}
