import { CanonicalBookInfo, CanonicalGenre } from '../types';

export const CANONICAL_BOOKS: CanonicalBookInfo[] = [
  // Antiguo Testamento - Pentateuco (1-5)
  { id: 1, abbr: 'GEN', name: 'Génesis', testament: 'OT', category: 'Pentateuco', bookNumber: 1, totalChapters: 50, totalVersesApprox: 1533 },
  { id: 2, abbr: 'EXO', name: 'Éxodo', testament: 'OT', category: 'Pentateuco', bookNumber: 2, totalChapters: 40, totalVersesApprox: 1213 },
  { id: 3, abbr: 'LEV', name: 'Levítico', testament: 'OT', category: 'Pentateuco', bookNumber: 3, totalChapters: 27, totalVersesApprox: 859 },
  { id: 4, abbr: 'NUM', name: 'Números', testament: 'OT', category: 'Pentateuco', bookNumber: 4, totalChapters: 36, totalVersesApprox: 1288 },
  { id: 5, abbr: 'DEU', name: 'Deuteronomio', testament: 'OT', category: 'Pentateuco', bookNumber: 5, totalChapters: 34, totalVersesApprox: 959 },

  // Históricos (6-17)
  { id: 6, abbr: 'JOS', name: 'Josué', testament: 'OT', category: 'Históricos', bookNumber: 6, totalChapters: 24, totalVersesApprox: 658 },
  { id: 7, abbr: 'JUE', name: 'Jueces', testament: 'OT', category: 'Históricos', bookNumber: 7, totalChapters: 21, totalVersesApprox: 618 },
  { id: 8, abbr: 'RUT', name: 'Rut', testament: 'OT', category: 'Históricos', bookNumber: 8, totalChapters: 4, totalVersesApprox: 85 },
  { id: 9, abbr: '1SAM', name: '1 Samuel', testament: 'OT', category: 'Históricos', bookNumber: 9, totalChapters: 31, totalVersesApprox: 810 },
  { id: 10, abbr: '2SAM', name: '2 Samuel', testament: 'OT', category: 'Históricos', bookNumber: 10, totalChapters: 24, totalVersesApprox: 695 },
  { id: 11, abbr: '1REYES', name: '1 Reyes', testament: 'OT', category: 'Históricos', bookNumber: 11, totalChapters: 22, totalVersesApprox: 816 },
  { id: 12, abbr: '2REYES', name: '2 Reyes', testament: 'OT', category: 'Históricos', bookNumber: 12, totalChapters: 25, totalVersesApprox: 719 },
  { id: 13, abbr: '1CRON', name: '1 Crónicas', testament: 'OT', category: 'Históricos', bookNumber: 13, totalChapters: 29, totalVersesApprox: 941 },
  { id: 14, abbr: '2CRON', name: '2 Crónicas', testament: 'OT', category: 'Históricos', bookNumber: 14, totalChapters: 36, totalVersesApprox: 822 },
  { id: 15, abbr: 'ESD', name: 'Esdras', testament: 'OT', category: 'Históricos', bookNumber: 15, totalChapters: 10, totalVersesApprox: 280 },
  { id: 16, abbr: 'NEH', name: 'Nehemías', testament: 'OT', category: 'Históricos', bookNumber: 16, totalChapters: 13, totalVersesApprox: 406 },
  { id: 17, abbr: 'EST', name: 'Ester', testament: 'OT', category: 'Históricos', bookNumber: 17, totalChapters: 10, totalVersesApprox: 167 },

  // Poéticos y Sapienciales (18-22)
  { id: 18, abbr: 'JOB', name: 'Job', testament: 'OT', category: 'Poéticos', bookNumber: 18, totalChapters: 42, totalVersesApprox: 1070 },
  { id: 19, abbr: 'SAL', name: 'Salmos', testament: 'OT', category: 'Poéticos', bookNumber: 19, totalChapters: 150, totalVersesApprox: 2461 },
  { id: 20, abbr: 'PROV', name: 'Proverbios', testament: 'OT', category: 'Poéticos', bookNumber: 20, totalChapters: 31, totalVersesApprox: 915 },
  { id: 21, abbr: 'ECLE', name: 'Eclesiastés', testament: 'OT', category: 'Poéticos', bookNumber: 21, totalChapters: 12, totalVersesApprox: 222 },
  { id: 22, abbr: 'CANTARES', name: 'Cantares', testament: 'OT', category: 'Poéticos', bookNumber: 22, totalChapters: 8, totalVersesApprox: 117 },

  // Profetas Mayores (23-27)
  { id: 23, abbr: 'ISA', name: 'Isaías', testament: 'OT', category: 'Profetas Mayores', bookNumber: 23, totalChapters: 66, totalVersesApprox: 1292 },
  { id: 24, abbr: 'JEREMIAS', name: 'Jeremías', testament: 'OT', category: 'Profetas Mayores', bookNumber: 24, totalChapters: 52, totalVersesApprox: 1364 },
  { id: 25, abbr: 'LAM', name: 'Lamentaciones', testament: 'OT', category: 'Profetas Mayores', bookNumber: 25, totalChapters: 5, totalVersesApprox: 154 },
  { id: 26, abbr: 'EZE', name: 'Ezequiel', testament: 'OT', category: 'Profetas Mayores', bookNumber: 26, totalChapters: 48, totalVersesApprox: 1273 },
  { id: 27, abbr: 'DAN', name: 'Daniel', testament: 'OT', category: 'Profetas Mayores', bookNumber: 27, totalChapters: 12, totalVersesApprox: 357 },

  // Profetas Menores (28-39)
  { id: 28, abbr: 'OSE', name: 'Oseas', testament: 'OT', category: 'Profetas Menores', bookNumber: 28, totalChapters: 14, totalVersesApprox: 197 },
  { id: 29, abbr: 'JOEL', name: 'Joel', testament: 'OT', category: 'Profetas Menores', bookNumber: 29, totalChapters: 3, totalVersesApprox: 73 },
  { id: 30, abbr: 'AMOS', name: 'Amós', testament: 'OT', category: 'Profetas Menores', bookNumber: 30, totalChapters: 9, totalVersesApprox: 146 },
  { id: 31, abbr: 'ABD', name: 'Abdías', testament: 'OT', category: 'Profetas Menores', bookNumber: 31, totalChapters: 1, totalVersesApprox: 21 },
  { id: 32, abbr: 'JON', name: 'Jonás', testament: 'OT', category: 'Profetas Menores', bookNumber: 32, totalChapters: 4, totalVersesApprox: 48 },
  { id: 33, abbr: 'MIQ', name: 'Miqueas', testament: 'OT', category: 'Profetas Menores', bookNumber: 33, totalChapters: 7, totalVersesApprox: 105 },
  { id: 34, abbr: 'NAH', name: 'Nahúm', testament: 'OT', category: 'Profetas Menores', bookNumber: 34, totalChapters: 3, totalVersesApprox: 47 },
  { id: 35, abbr: 'HAB', name: 'Habacuc', testament: 'OT', category: 'Profetas Menores', bookNumber: 35, totalChapters: 3, totalVersesApprox: 56 },
  { id: 36, abbr: 'SOF', name: 'Sofonías', testament: 'OT', category: 'Profetas Menores', bookNumber: 36, totalChapters: 3, totalVersesApprox: 53 },
  { id: 37, abbr: 'HAG', name: 'Hageo', testament: 'OT', category: 'Profetas Menores', bookNumber: 37, totalChapters: 2, totalVersesApprox: 38 },
  { id: 38, abbr: 'ZAC', name: 'Zacarías', testament: 'OT', category: 'Profetas Menores', bookNumber: 38, totalChapters: 14, totalVersesApprox: 211 },
  { id: 39, abbr: 'MAL', name: 'Malaquías', testament: 'OT', category: 'Profetas Menores', bookNumber: 39, totalChapters: 4, totalVersesApprox: 55 },

  // Nuevo Testamento - Evangelios (40-43)
  { id: 40, abbr: 'MAT', name: 'Mateo', testament: 'NT', category: 'Evangelios', bookNumber: 40, totalChapters: 28, totalVersesApprox: 1071 },
  { id: 41, abbr: 'MAR', name: 'Marcos', testament: 'NT', category: 'Evangelios', bookNumber: 41, totalChapters: 16, totalVersesApprox: 678 },
  { id: 42, abbr: 'LUC', name: 'Lucas', testament: 'NT', category: 'Evangelios', bookNumber: 42, totalChapters: 24, totalVersesApprox: 1151 },
  { id: 43, abbr: 'JN', name: 'Juan', testament: 'NT', category: 'Evangelios', bookNumber: 43, totalChapters: 21, totalVersesApprox: 879 },

  // Hechos (44)
  { id: 44, abbr: 'HEC', name: 'Hechos', testament: 'NT', category: 'Hechos', bookNumber: 44, totalChapters: 28, totalVersesApprox: 1007 },

  // Epístolas Paulinas (45-57)
  { id: 45, abbr: 'ROM', name: 'Romanos', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 45, totalChapters: 16, totalVersesApprox: 433 },
  { id: 46, abbr: '1COR', name: '1 Corintios', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 46, totalChapters: 16, totalVersesApprox: 437 },
  { id: 47, abbr: '2COR', name: '2 Corintios', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 47, totalChapters: 13, totalVersesApprox: 257 },
  { id: 48, abbr: 'GAL', name: 'Gálatas', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 48, totalChapters: 6, totalVersesApprox: 149 },
  { id: 49, abbr: 'EFE', name: 'Efesios', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 49, totalChapters: 6, totalVersesApprox: 155 },
  { id: 50, abbr: 'FIL', name: 'Filipenses', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 50, totalChapters: 4, totalVersesApprox: 104 },
  { id: 51, abbr: 'COL', name: 'Colosenses', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 51, totalChapters: 4, totalVersesApprox: 95 },
  { id: 52, abbr: '1TES', name: '1 Tesalonicenses', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 52, totalChapters: 5, totalVersesApprox: 89 },
  { id: 53, abbr: '2TES', name: '2 Tesalonicenses', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 53, totalChapters: 3, totalVersesApprox: 47 },
  { id: 54, abbr: '1TIM', name: '1 Timoteo', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 54, totalChapters: 6, totalVersesApprox: 113 },
  { id: 55, abbr: '2TIM', name: '2 Timoteo', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 55, totalChapters: 4, totalVersesApprox: 83 },
  { id: 56, abbr: 'TIT', name: 'Tito', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 56, totalChapters: 3, totalVersesApprox: 46 },
  { id: 57, abbr: 'FLM', name: 'Filemón', testament: 'NT', category: 'Epístolas Paulinas', bookNumber: 57, totalChapters: 1, totalVersesApprox: 25 },

  // Epístolas Generales (58-65)
  { id: 58, abbr: 'HEB', name: 'Hebreos', testament: 'NT', category: 'Epístolas Generales', bookNumber: 58, totalChapters: 13, totalVersesApprox: 303 },
  { id: 59, abbr: 'SNT', name: 'Santiago', testament: 'NT', category: 'Epístolas Generales', bookNumber: 59, totalChapters: 5, totalVersesApprox: 108 },
  { id: 60, abbr: '1PED', name: '1 Pedro', testament: 'NT', category: 'Epístolas Generales', bookNumber: 60, totalChapters: 5, totalVersesApprox: 105 },
  { id: 61, abbr: '2PED', name: '2 Pedro', testament: 'NT', category: 'Epístolas Generales', bookNumber: 61, totalChapters: 3, totalVersesApprox: 61 },
  { id: 62, abbr: '1JN', name: '1 Juan', testament: 'NT', category: 'Epístolas Generales', bookNumber: 62, totalChapters: 5, totalVersesApprox: 105 },
  { id: 63, abbr: '2JN', name: '2 Juan', testament: 'NT', category: 'Epístolas Generales', bookNumber: 63, totalChapters: 1, totalVersesApprox: 13 },
  { id: 64, abbr: '3JN', name: '3 Juan', testament: 'NT', category: 'Epístolas Generales', bookNumber: 64, totalChapters: 1, totalVersesApprox: 14 },
  { id: 65, abbr: 'JUD', name: 'Judas', testament: 'NT', category: 'Epístolas Generales', bookNumber: 65, totalChapters: 1, totalVersesApprox: 25 },

  // Apocalipsis (66)
  { id: 66, abbr: 'APO', name: 'Apocalipsis', testament: 'NT', category: 'Apocalipsis', bookNumber: 66, totalChapters: 22, totalVersesApprox: 404 },
];

export const GENRE_COLORS: Record<CanonicalGenre, { bg: string; text: string; border: string; dot: string }> = {
  Pentateuco: { bg: 'bg-amber-500/10 dark:bg-amber-500/15', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/30', dot: '#f59e0b' },
  Históricos: { bg: 'bg-orange-500/10 dark:bg-orange-500/15', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-500/30', dot: '#f97316' },
  Poéticos: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500/30', dot: '#10b981' },
  'Profetas Mayores': { bg: 'bg-indigo-500/10 dark:bg-indigo-500/15', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-500/30', dot: '#6366f1' },
  'Profetas Menores': { bg: 'bg-violet-500/10 dark:bg-violet-500/15', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-500/30', dot: '#8b5cf6' },
  Evangelios: { bg: 'bg-blue-500/10 dark:bg-blue-500/15', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-500/30', dot: '#3b82f6' },
  Hechos: { bg: 'bg-cyan-500/10 dark:bg-cyan-500/15', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-500/30', dot: '#06b6d4' },
  'Epístolas Paulinas': { bg: 'bg-purple-500/10 dark:bg-purple-500/15', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-500/30', dot: '#a855f7' },
  'Epístolas Generales': { bg: 'bg-rose-500/10 dark:bg-rose-500/15', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-500/30', dot: '#f43f5e' },
  Apocalipsis: { bg: 'bg-red-500/10 dark:bg-red-500/15', text: 'text-red-700 dark:text-red-400', border: 'border-red-500/30', dot: '#ef4444' },
};
