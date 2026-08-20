import { PaulinePassageDiscourse } from '../types';

export const PAULINE_DISCOURSE_DATABASE: PaulinePassageDiscourse[] = [
  {
    id: 'romans-8-1-4',
    bookAbbreviation: 'ROM',
    bookName: 'Romanos',
    passageRef: 'Romanos 8:1-4',
    title: 'La Base Trinitaria de la No Condenación en Cristo Jesús',
    theologicalTheme: 'La liberación definitiva del régimen del pecado y de la muerte operada por el Espíritu de vida.',
    centralProposition: 'Ninguna condenación hay para los que están unidos vitalmente a Cristo Jesús.',
    clauses: [
      {
        id: 'c1',
        verseRef: 'Romanos 8:1',
        indentationLevel: 0,
        clauseType: 'main',
        conjunction: {
          greek: 'ἄρα',
          transliteration: 'ara',
          gloss: 'Por consiguiente / Así pues',
          category: 'inferential',
          syntacticRole: 'Conclusión mayúscula que se desprende de la justificación por la fe tratada en Romanos 3-7.',
        },
        textSpanish: 'Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús.',
        textGreek: 'Οὐδὲν ἄρα νῦν κατάκριμα τοῖς ἐν Χριστῷ Ἰησοῦ.',
        grammaticalAnalysis: 'Proposición principal con adverbio temporal (νῦν) y sustantivo enfático con negación absoluta (οὐδὲν κατάκριμα).',
        theologicalFlow: 'Establece la tesis dogmática suprema del creyente redimido.',
      },
      {
        id: 'c2',
        verseRef: 'Romanos 8:2',
        indentationLevel: 1,
        clauseType: 'subordinate_causal',
        conjunction: {
          greek: 'γάρ',
          transliteration: 'gar',
          gloss: 'porque / pues',
          category: 'causal',
          syntacticRole: 'Introduce el fundamento causal de la no condenación declarada en v.1.',
        },
        textSpanish: 'porque la ley del Espíritu de vida en Cristo Jesús me ha librado de la ley del pecado y de la muerte.',
        textGreek: 'ὁ γὰρ νόμος τοῦ πνεύματος τῆς ζωῆς ἐν Χριστῷ Ἰησοῦ ἠλευθέρωσέν σε ἀπὸ τοῦ νόμου τῆς ἁμαρτίας καὶ τοῦ θανάτου.',
        grammaticalAnalysis: 'Oración subordinada causal introducida por γάρ con verbo en Aoristo Indicativo Activo (ἠλευθέρωσεν = liberó de una vez y para siempre).',
        theologicalFlow: 'Explica el mecanismo pneumatológico y cristocéntrico de la victoria sobre el régimen de muerte.',
      },
    ],
  },
];
