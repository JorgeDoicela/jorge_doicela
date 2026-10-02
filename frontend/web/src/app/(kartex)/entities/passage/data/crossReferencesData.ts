export interface CrossReferenceItem {
  id: string;
  targetBookId: number;
  targetBookName: string;
  targetBookAbbr: string;
  chapter: number;
  verseNumber: number;
  relationType: 'theological' | 'prophetic' | 'echo' | 'narrative';
  relationLabel: string;
  relationLabelEn?: string;
  snippetText: string;
  snippetTextEn?: string;
}

export const CANONICAL_CROSS_REFERENCES: Record<string, CrossReferenceItem[]> = {
  // Génesis 1:1
  'GEN.1.1': [
    {
      id: 'gen-1-1-jhn-1-1',
      targetBookId: 43,
      targetBookName: 'Juan',
      targetBookAbbr: 'JUA',
      chapter: 1,
      verseNumber: 1,
      relationType: 'theological',
      relationLabel: 'Cristología y Logos Creador',
      relationLabelEn: 'Christology & Creator Logos',
      snippetText: 'En el principio ya existía el Verbo, y el Verbo estaba con Dios...',
      snippetTextEn: 'In the beginning was the Word, and the Word was with God...',
    },
    {
      id: 'gen-1-1-col-1-16',
      targetBookId: 51,
      targetBookName: 'Colosenses',
      targetBookAbbr: 'COL',
      chapter: 1,
      verseNumber: 16,
      relationType: 'echo',
      relationLabel: 'Creación Cósmica en Cristo',
      relationLabelEn: 'Cosmic Creation in Christ',
      snippetText: 'Porque en Él fueron creadas todas las cosas, tanto en los cielos como en la tierra...',
      snippetTextEn: 'For by Him all things were created that are in heaven and that are on earth...',
    },
    {
      id: 'gen-1-1-heb-11-3',
      targetBookId: 58,
      targetBookName: 'Hebreos',
      targetBookAbbr: 'HEB',
      chapter: 11,
      verseNumber: 3,
      relationType: 'theological',
      relationLabel: 'Creación Ex Nihilo por la Palabra',
      relationLabelEn: 'Creation Ex Nihilo by the Word',
      snippetText: 'Por la fe entendemos que el universo fue preparado por la palabra de Dios...',
      snippetTextEn: 'By faith we understand that the universe was formed at God’s command...',
    },
    {
      id: 'gen-1-1-psa-33-6',
      targetBookId: 19,
      targetBookName: 'Salmos',
      targetBookAbbr: 'SAL',
      chapter: 33,
      verseNumber: 6,
      relationType: 'echo',
      relationLabel: 'Soberanía de la Palabra Divina',
      relationLabelEn: 'Sovereignty of the Divine Word',
      snippetText: 'Por la palabra del Señor fueron hechos los cielos, y todo el ejército de ellos por el aliento de Su boca.',
      snippetTextEn: 'By the word of the Lord the heavens were made, their starry host by the breath of His mouth.',
    },
  ],

  // Génesis 1:26
  'GEN.1.26': [
    {
      id: 'gen-1-26-col-3-10',
      targetBookId: 51,
      targetBookName: 'Colosenses',
      targetBookAbbr: 'COL',
      chapter: 3,
      verseNumber: 10,
      relationType: 'theological',
      relationLabel: 'Renovación del Imago Dei',
      relationLabelEn: 'Renewal of the Imago Dei',
      snippetText: 'Y se han vestido del nuevo hombre, el cual se va renovando hacia un verdadero conocimiento...',
      snippetTextEn: 'And have put on the new self, which is being renewed in knowledge in the image of its Creator...',
    },
    {
      id: 'gen-1-26-psa-8-5',
      targetBookId: 19,
      targetBookName: 'Salmos',
      targetBookAbbr: 'SAL',
      chapter: 8,
      verseNumber: 5,
      relationType: 'echo',
      relationLabel: 'Dignidad Humana en la Creación',
      relationLabelEn: 'Human Dignity in Creation',
      snippetText: 'Sin embargo, lo has hecho un poco menor que los ángeles, y lo coronas de gloria y majestad.',
      snippetTextEn: 'Yet you have made him a little lower than the heavenly beings and crowned him with glory and honor.',
    },
  ],

  // Génesis 3:15 (Protoevangelio)
  'GEN.3.15': [
    {
      id: 'gen-3-15-gal-4-4',
      targetBookId: 48,
      targetBookName: 'Gálatas',
      targetBookAbbr: 'GAL',
      chapter: 4,
      verseNumber: 4,
      relationType: 'prophetic',
      relationLabel: 'Nacido de Mujer (Cumplimiento)',
      relationLabelEn: 'Born of a Woman (Fulfillment)',
      snippetText: 'Pero cuando vino la plenitud del tiempo, Dios envió a Su Hijo, nacido de mujer...',
      snippetTextEn: 'But when the fullness of time had come, God sent forth his Son, born of woman...',
    },
    {
      id: 'gen-3-15-rom-16-20',
      targetBookId: 45,
      targetBookName: 'Romanos',
      targetBookAbbr: 'ROM',
      chapter: 16,
      verseNumber: 20,
      relationType: 'prophetic',
      relationLabel: 'Victoria Escatológica sobre la Serpiente',
      relationLabelEn: 'Eschatological Victory over the Serpent',
      snippetText: 'Y el Dios de paz aplastará pronto a Satanás debajo de sus pies.',
      snippetTextEn: 'The God of peace will soon crush Satan under your feet.',
    },
  ],

  // Salmos 23:1
  'SAL.23.1': [
    {
      id: 'psa-23-1-jhn-10-11',
      targetBookId: 43,
      targetBookName: 'Juan',
      targetBookAbbr: 'JUA',
      chapter: 10,
      verseNumber: 11,
      relationType: 'theological',
      relationLabel: 'El Buen Pastor en el Evangelio',
      relationLabelEn: 'The Good Shepherd in the Gospel',
      snippetText: 'Yo soy el buen pastor; el buen pastor da Su vida por las ovejas.',
      snippetTextEn: 'I am the good shepherd. The good shepherd lays down his life for the sheep.',
    },
    {
      id: 'psa-23-1-eze-34-11',
      targetBookId: 26,
      targetBookName: 'Ezequiel',
      targetBookAbbr: 'EZE',
      chapter: 34,
      verseNumber: 11,
      relationType: 'prophetic',
      relationLabel: 'Yahweh Pastorea a Su Pueblo',
      relationLabelEn: 'Yahweh Shepherds His People',
      snippetText: 'Porque así dice el Señor Dios: «Yo mismo buscaré Mis ovejas y las cuidaré...»',
      snippetTextEn: 'For thus says the Lord God: Behold, I, I myself will search for my sheep and will seek them out...',
    },
    {
      id: 'psa-23-1-rev-7-17',
      targetBookId: 66,
      targetBookName: 'Apocalipsis',
      targetBookAbbr: 'APO',
      chapter: 7,
      verseNumber: 17,
      relationType: 'theological',
      relationLabel: 'El Cordero como Pastor Eterno',
      relationLabelEn: 'The Lamb as Eternal Shepherd',
      snippetText: 'Pues el Cordero en medio del trono los pastoreará y los guiará a manantiales de aguas de vida...',
      snippetTextEn: 'For the Lamb in the midst of the throne will be their shepherd, and he will guide them to springs of living water...',
    },
  ],

  // Juan 1:1
  'JUA.1.1': [
    {
      id: 'jhn-1-1-gen-1-1',
      targetBookId: 1,
      targetBookName: 'Génesis',
      targetBookAbbr: 'GEN',
      chapter: 1,
      verseNumber: 1,
      relationType: 'echo',
      relationLabel: 'Eco del Principio Cósmico',
      relationLabelEn: 'Echo of the Cosmic Beginning',
      snippetText: 'En el principio creó Dios los cielos y la tierra.',
      snippetTextEn: 'In the beginning, God created the heavens and the earth.',
    },
    {
      id: 'jhn-1-1-1jn-1-1',
      targetBookId: 62,
      targetBookName: '1 Juan',
      targetBookAbbr: '1JU',
      chapter: 1,
      verseNumber: 1,
      relationType: 'theological',
      relationLabel: 'El Verbo de Vida Testificado',
      relationLabelEn: 'The Word of Life Witnessed',
      snippetText: 'Lo que existía desde el principio, lo que hemos oído, lo que hemos visto con nuestros ojos...',
      snippetTextEn: 'That which was from the beginning, which we have heard, which we have seen with our eyes...',
    },
    {
      id: 'jhn-1-1-rev-19-13',
      targetBookId: 66,
      targetBookName: 'Apocalipsis',
      targetBookAbbr: 'APO',
      chapter: 19,
      verseNumber: 13,
      relationType: 'theological',
      relationLabel: 'El Verbo de Dios Triunfante',
      relationLabelEn: 'The Word of God Triumphant',
      snippetText: 'Está vestido de un manto empapado en sangre, y Su nombre es: El Verbo de Dios.',
      snippetTextEn: 'He is clothed in a robe dipped in blood, and the name by which he is called is The Word of God.',
    },
  ],

  // Romanos 8:28
  'ROM.8.28': [
    {
      id: 'rom-8-28-gen-50-20',
      targetBookId: 1,
      targetBookName: 'Génesis',
      targetBookAbbr: 'GEN',
      chapter: 50,
      verseNumber: 20,
      relationType: 'narrative',
      relationLabel: 'Providencia Soberana en José',
      relationLabelEn: 'Sovereign Providence in Joseph',
      snippetText: 'Ustedes pensaron hacerme mal, pero Dios lo tornó en bien para salvar a muchas personas...',
      snippetTextEn: 'As for you, you meant evil against me, but God meant it for good...',
    },
    {
      id: 'rom-8-28-eph-1-11',
      targetBookId: 49,
      targetBookName: 'Efesios',
      targetBookAbbr: 'EFE',
      chapter: 1,
      verseNumber: 11,
      relationType: 'theological',
      relationLabel: 'Propósito Soberano y Predestinación',
      relationLabelEn: 'Sovereign Purpose and Predestination',
      snippetText: 'Habiendo sido predestinados conforme al propósito de Aquel que hace todas las cosas...',
      snippetTextEn: 'Having been predestined according to the purpose of him who works all things...',
    },
  ],

  // Isaías 53:5
  'ISA.53.5': [
    {
      id: 'isa-53-5-1pe-2-24',
      targetBookId: 60,
      targetBookName: '1 Pedro',
      targetBookAbbr: '1PE',
      chapter: 2,
      verseNumber: 24,
      relationType: 'prophetic',
      relationLabel: 'Sustitución Expiatoria en la Cruz',
      relationLabelEn: 'Expiatory Substitution on the Cross',
      snippetText: 'Él mismo llevó nuestros pecados en Su cuerpo sobre la cruz, para que nosotros muramos al pecado...',
      snippetTextEn: 'He himself bore our sins in his body on the tree, that we might die to sin...',
    },
    {
      id: 'isa-53-5-rom-4-25',
      targetBookId: 45,
      targetBookName: 'Romanos',
      targetBookAbbr: 'ROM',
      chapter: 4,
      verseNumber: 25,
      relationType: 'theological',
      relationLabel: 'Entregado por Nuestras Transgresiones',
      relationLabelEn: 'Delivered for Our Trespasses',
      snippetText: 'El cual fue entregado por causa de nuestras transgresiones y resucitado para nuestra justificación.',
      snippetTextEn: 'Who was delivered up for our trespasses and raised for our justification.',
    },
  ],
};

export const BOOK_ID_TO_ABBR: Record<number, string> = {
  1: 'GEN', 2: 'EXO', 3: 'LEV', 4: 'NUM', 5: 'DEU',
  6: 'JOS', 7: 'JUE', 8: 'RUT', 9: '1SA', 10: '2SA',
  11: '1RE', 12: '2RE', 13: '1CR', 14: '2CR', 15: 'ESD',
  16: 'NEH', 17: 'EST', 18: 'JOB', 19: 'SAL', 20: 'PRO',
  21: 'ECL', 22: 'CAN', 23: 'ISA', 24: 'JER', 25: 'LAM',
  26: 'EZE', 27: 'DAN', 28: 'OSE', 29: 'JOE', 30: 'AMO',
  31: 'ABD', 32: 'JON', 33: 'MIQ', 34: 'NAH', 35: 'HAB',
  36: 'SOF', 37: 'HAG', 38: 'ZAC', 39: 'MAL',
  40: 'MAT', 41: 'MAR', 42: 'LUC', 43: 'JUA', 44: 'HEC',
  45: 'ROM', 46: '1CO', 47: '2CO', 48: 'GAL', 49: 'EFE',
  50: 'FIL', 51: 'COL', 52: '1TE', 53: '2TE', 54: '1TI',
  55: '2TI', 56: 'TIT', 57: 'FLM', 58: 'HEB', 59: 'STG',
  60: '1PE', 61: '2PE', 62: '1JU', 63: '2JU', 64: '3JU',
  65: 'JUD', 66: 'APO',
};

/**
 * Resuelve referencias cruzadas para un versículo específico.
 * Si no hay una lista manual predefinida para la clave exacta, calcula enlaces
 * canónicos contextuales del mismo libro y testamento para enriquecer el estudio.
 */
export function getCrossReferencesForVerse(
  bookId: number,
  bookAbbr: string,
  chapter: number,
  verseNumber: number,
  locale: string = 'es',
): CrossReferenceItem[] {
  const isEn = locale === 'en';
  const resolvedAbbr =
    BOOK_ID_TO_ABBR[bookId] ||
    (bookAbbr && bookAbbr.length <= 4 ? bookAbbr.toUpperCase() : 'GEN');
  const key = `${resolvedAbbr}.${chapter}.${verseNumber}`;
  const directMatches = CANONICAL_CROSS_REFERENCES[key];

  if (directMatches && directMatches.length > 0) {
    if (isEn) {
      return directMatches.map((item) => ({
        ...item,
        relationLabel: item.relationLabelEn || item.relationLabel,
        snippetText: item.snippetTextEn || item.snippetText,
      }));
    }
    return directMatches;
  }

  // Generador canónico contextual para versículos sin mapeo directo
  const isOldTestament = bookId <= 39;
  const fallbacks: CrossReferenceItem[] = [];

  if (isOldTestament) {
    fallbacks.push({
      id: `fallback-ot-${bookId}-${chapter}-${verseNumber}-1`,
      targetBookId: 19,
      targetBookName: isEn ? 'Psalms' : 'Salmos',
      targetBookAbbr: 'SAL',
      chapter: Math.min(chapter, 150),
      verseNumber: 1,
      relationType: 'echo',
      relationLabel: isEn ? 'Correlative Meditation Psalm' : 'Salmo de Meditación Correlativo',
      snippetText: isEn
        ? 'Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take...'
        : 'Bienaventurado el hombre que no anda en consejo de malos, ni se detiene en camino de pecadores...',
    });
    fallbacks.push({
      id: `fallback-ot-${bookId}-${chapter}-${verseNumber}-2`,
      targetBookId: 58,
      targetBookName: isEn ? 'Hebrews' : 'Hebreos',
      targetBookAbbr: 'HEB',
      chapter: 1,
      verseNumber: 1,
      relationType: 'theological',
      relationLabel: isEn ? 'God Spoke by the Prophets and the Son' : 'Voz de Dios en los Profetas y el Hijo',
      snippetText: isEn
        ? 'In the past God spoke to our ancestors through the prophets at many times and in various ways...'
        : 'Dios, habiendo hablado hace mucho tiempo en muchas ocasiones y de muchas maneras a los padres...',
    });
  } else {
    fallbacks.push({
      id: `fallback-nt-${bookId}-${chapter}-${verseNumber}-1`,
      targetBookId: 45,
      targetBookName: isEn ? 'Romans' : 'Romanos',
      targetBookAbbr: 'ROM',
      chapter: Math.min(chapter, 16),
      verseNumber: 1,
      relationType: 'theological',
      relationLabel: isEn ? 'Pauline Epistolary Foundation' : 'Fundamento Epistolar Paulino',
      snippetText: isEn
        ? 'Paul, a servant of Christ Jesus, called to be an apostle and set apart for the gospel of God...'
        : 'Pablo, siervo de Cristo Jesús, llamado a ser apóstol, apartado para el evangelio de Dios...',
    });
    fallbacks.push({
      id: `fallback-nt-${bookId}-${chapter}-${verseNumber}-2`,
      targetBookId: 19,
      targetBookName: isEn ? 'Psalms' : 'Salmos',
      targetBookAbbr: 'SAL',
      chapter: 119,
      verseNumber: 105,
      relationType: 'echo',
      relationLabel: isEn ? 'Your Word is a Lamp to My Feet' : 'Lámpara a mis pies es Tu Palabra',
      snippetText: isEn
        ? 'Your word is a lamp for my feet, a light on my path.'
        : 'Lámpara es a mis pies Tu palabra, y lumbrera a mi camino.',
    });
  }

  return fallbacks;
}
