export type ParallelismType =
  | 'synonymous' // Paralelismo Sinónimo (segunda línea reitera la idea con sinónimos)
  | 'antithetic' // Paralelismo Antitético (segunda línea contrasta la idea)
  | 'synthetic' // Paralelismo Sintético / Progresivo (segunda línea expande la idea)
  | 'climactic' // Paralelismo Escalonado / Clímax (repetición que culmina en clímax)
  | 'introverted_chiasm'; // Quiasmo concéntrico invertido A-B-B'-A'

export interface PoeticColon {
  id: string;
  label: string; // Ej: 'A', 'B', 'C', "B'", "A'" o 'A1', 'A2'
  matchingPairId?: string; // ID del colon gemelo simétrico (ej. A hace juego con A')
  verseRef: string; // Ej. "Salmo 67:1"
  textSpanish: string; // Texto en español
  textHebrew?: string; // Texto hebreo masorético original
  isFocalCenter?: boolean; // Si es el centro o clímax del quiasmo
  parallelismType?: ParallelismType;
  theologicalNote?: string; // Nota explicativa de la función poética
}

export interface ChiasmStructure {
  id: string;
  bookAbbreviation: string;
  bookName: string;
  passageRef: string; // Ej: "Salmo 67:1-7"
  title: string;
  description: string;
  literaryCategory: 'Salmos' | 'Proverbios' | 'Profetas';
  focalMessage: string; // El mensaje teológico central del clímax quiástico
  cola: PoeticColon[];
}

export type ConjunctionCategory =
  | 'causal' // γάρ, ὅτι, διότι (porque, pues, ya que)
  | 'conditional' // εἰ, ἐάν (si, en caso de que)
  | 'purpose' // ἵνα, ὥστε, ὅπως (para que, a fin de que)
  | 'inferential' // οὖν, ἄρα, διό (por tanto, pues, en consecuencia)
  | 'adversative'; // ἀλλά, δέ (sino, mas, pero)

export interface GreekConjunctionInfo {
  greek: string;
  transliteration: string;
  gloss: string;
  category: ConjunctionCategory;
  syntacticRole: string; // Ej: "Introduce la base causal de la no condenación"
}

export interface DiscourseClause {
  id: string;
  verseRef: string; // Ej: "Romanos 8:1"
  indentationLevel: number; // 0 para proposición principal, 1, 2 para subordinadas
  clauseType: 'main' | 'subordinate_causal' | 'subordinate_purpose' | 'subordinate_conditional' | 'subordinate_relative' | 'subordinate_adversative' | 'result';
  conjunction?: GreekConjunctionInfo;
  textSpanish: string; // Proposición en español
  textGreek?: string; // Proposición en griego original
  grammaticalAnalysis: string; // Resumen gramatical (ej. "Verbo Indicativo Presente")
  theologicalFlow: string; // Explicación de la conexión lógica con la cláusula anterior
}

export interface PaulinePassageDiscourse {
  id: string;
  bookAbbreviation: string;
  bookName: string;
  passageRef: string; // Ej: "Romanos 8:1-11"
  title: string;
  theologicalTheme: string;
  centralProposition: string; // Tesis dogmática central
  clauses: DiscourseClause[];
}

export type LiteraryViewSubMode = 'poetic_chiasm' | 'pauline_discourse';
