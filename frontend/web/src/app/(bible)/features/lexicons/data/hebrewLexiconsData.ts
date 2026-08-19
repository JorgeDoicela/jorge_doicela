import { HebrewLexiconEntry } from '../types';

export const HEBREW_LEXICONS_DATABASE: HebrewLexiconEntry[] = [
  // =========================================================================
  // RAÍZ: ב-ר-א (b-r-') -> H1254 (Bara)
  // =========================================================================
  {
    id: 'root-bra',
    root: 'ב-ר-א',
    rootTransliteration: "b-r-'",
    strongPrimary: 'H1254',
    lemma: 'בָּרָא',
    language: 'Hebreo',
    partOfSpeech: 'Verbo',
    gloss: 'Crear, dar existencia, modelar (obra divina exclusiva)',
    occurrences: 54,
    cognates: [
      "Ugarítico: br' (formar, crear)",
      "Árabe: bara'a (crear a partir de la nada)",
      'Arameo bíblico y targúmico: בְּרָא (crear)',
      'Acadio: banû (construir, engendrar)',
    ],
    derivedWords: [
      {
        strong: 'H1254',
        wordHebrew: 'בָּרָא',
        transliteration: 'bara',
        partOfSpeech: 'Verbo Qal',
        gloss: 'Crear divinamente (Génesis 1:1, Salmos 51:10)',
        occurrences: 48,
      },
      {
        strong: 'H1254b',
        wordHebrew: 'נִבְרָא',
        transliteration: 'nibra',
        partOfSpeech: 'Verbo Niphal',
        gloss: 'Ser creado, traído a la existencia (Génesis 2:4)',
        occurrences: 6,
      },
      {
        strong: 'H1277',
        wordHebrew: 'בָּרִיא',
        transliteration: 'bari',
        partOfSpeech: 'Adjetivo',
        gloss: 'Robusto, grueso, sano (Génesis 41:2)',
        occurrences: 14,
      },
      {
        strong: 'H1278',
        wordHebrew: 'בְּרִיאָה',
        transliteration: 'beriah',
        partOfSpeech: 'Sustantivo femenino',
        gloss: 'Cosa nueva, prodigio sin precedentes (Números 16:30)',
        occurrences: 1,
      },
    ],
    bdb: {
      rootEtymology:
        'Raíz semítica primaria que designa la actividad creativa de la cual solo Dios es sujeto gramatical. Nunca lleva mención de materia preexistente en Qal.',
      sections: [
        {
          number: '1',
          stem: 'Qal',
          definition:
            'Dar forma, crear, hacer surgir lo nuevo en el cosmos, la historia o la redención interior.',
          biblicalRefs: ['Génesis 1:1', 'Génesis 1:21', 'Génesis 1:27', 'Isaías 40:26', 'Salmos 51:10'],
        },
        {
          number: '2',
          stem: 'Niphal',
          definition:
            'Ser creado, ser llamado a la existencia por orden soberana divina.',
          biblicalRefs: ['Génesis 2:4', 'Génesis 5:2', 'Salmos 102:18', 'Salmos 104:30', 'Ezequiel 21:30'],
        },
        {
          number: '3',
          stem: 'Piel',
          definition:
            'Cortar, talar madera, desbrozar un bosque (Josué 17:15, 18) o tallar una imagen con relieve.',
          biblicalRefs: ['Josué 17:15', 'Josué 17:18', 'Ezequiel 23:47'],
        },
      ],
    },
    gesenius: {
      philologicalNotes:
        'Gesenius observa la afinidad primordial entre בָּרָא (cortar/tallar) y בָּרָה (separar/escoger). La noción de crear procede de separar y ordenar el caos primigenio en formas perfectas y armoniosas.',
      derivationDiscussion:
        'En las lenguas semíticas del norte y sur, la raíz oscila entre el acto material de tallar piedra/madera y la operación metafísica de inaugurar existencia.',
      grammaticalForms: [
        'Qal Perfecto 3ms: בָּרָא (bara)',
        'Qal Imperfecto 3ms: יִבְרָא (yibra)',
        'Qal Participio Activo ms: בּוֹרֵא (bore - Creador)',
        'Qal Infinitivo Constructo: בְּרוֹא (bero)',
      ],
    },
    dtat: {
      theologicalConcept:
        'Bara es un término de soberanía absoluta: no requiere esfuerzo físico, fatiga ni intermediarios. Dios crea mediante la palabra hablada (Fiat Creator).',
      covenantContext:
        'En los profetas (especialmente en el Deuteroisaías), Bara se traslada de la cosmología inicial a la soteriología escatológica: Dios crea un corazón limpio (Salmo 51:10) y crea cielos nuevos y tierra nueva (Isaías 65:17).',
      messianicTypology:
        'Anticipa la Nueva Creación consumada en Cristo Jesús (2 Corintios 5:17, Juan 1:1-3, Colosenses 1:16).',
    },
  },

  // =========================================================================
  // RAÍZ: ר-א-שׁ (r-'-sh) -> H7225 (Reshit) & H7218 (Rosh)
  // =========================================================================
  {
    id: 'root-rsh',
    root: 'ר-א-שׁ',
    rootTransliteration: "r-'-sh",
    strongPrimary: 'H7225',
    lemma: 'רֵאשִׁית',
    language: 'Hebreo',
    partOfSpeech: 'Sustantivo femenino',
    gloss: 'Principio, primicias, cúspide, inicio soberano de una serie temporal o jerárquica',
    occurrences: 51,
    cognates: [
      "Acadio: rēšu (cabeza, cumbre, principio)",
      "Ugarítico: r'ish (cabeza, líder)",
      'Arameo: רֵישָׁא (reisha - cabeza, principio)',
      "Árabe: ra's (cabeza)",
    ],
    derivedWords: [
      {
        strong: 'H7218',
        wordHebrew: 'רֹאשׁ',
        transliteration: 'rosh',
        partOfSpeech: 'Sustantivo masculino',
        gloss: 'Cabeza, jefe, cumbre de montaña (Génesis 3:15, Salmos 23:5)',
        occurrences: 600,
      },
      {
        strong: 'H7225',
        wordHebrew: 'רֵאשִׁית',
        transliteration: 'reshit',
        partOfSpeech: 'Sustantivo femenino',
        gloss: 'Principio, punto de partida, primicias de la cosecha (Génesis 1:1, Proverbios 1:7)',
        occurrences: 51,
      },
      {
        strong: 'H7223',
        wordHebrew: 'רִאשׁוֹן',
        transliteration: 'rishon',
        partOfSpeech: 'Adjetivo ordinal',
        gloss: 'Primero, anterior, antiguo (Génesis 25:25, Isaías 44:6)',
        occurrences: 182,
      },
    ],
    bdb: {
      rootEtymology:
        'Derivado de רֹאשׁ (cabeza), designa lo que ocupa la posición frontal en el tiempo, en el espacio o en la dignidad espiritual.',
      sections: [
        {
          number: '1',
          definition:
            'Comienzo temporal absoluto o inicial de un período determinado.',
          biblicalRefs: ['Génesis 1:1', 'Deuteronomio 11:12', 'Isaías 46:10'],
        },
        {
          number: '2',
          definition:
            'Primicias consagradas a Dios de los frutos de la tierra o del rebaño.',
          biblicalRefs: ['Éxodo 23:19', 'Levítico 2:12', 'Números 18:12', 'Deuteronomio 26:2'],
        },
        {
          number: '3',
          definition:
            'La parte principal, lo selecto, lo supremo en rango o calidad.',
          biblicalRefs: ['Proverbios 1:7', 'Proverbios 4:7', 'Salmos 111:10', 'Amós 6:6'],
        },
      ],
    },
    gesenius: {
      philologicalNotes:
        'Gesenius destaca que בְּרֵאשִׁית en Génesis 1:1 se halla en estado constructo virtual con la cláusula verbal siguiente o como determinación adverbial absoluta del arranque del cosmos.',
      derivationDiscussion:
        'La raíz conecta la anatomía del cuerpo (la cabeza como sede del gobierno del hombre) con la estructura del tiempo histórico y cósmico.',
      grammaticalForms: [
        'Sustantivo absoluto: רֵאשִׁית (reshit)',
        'Con prefijo preposicional: בְּרֵאשִׁית (bereshit - en el principio)',
        'Plural constructo de rosh: רָאשֵׁי (rashei - cabezas de)',
      ],
    },
    dtat: {
      theologicalConcept:
        'Reshit no es un mero punto cronológico neutro, sino la inauguración deliberada del escenario del pacto de redención.',
      covenantContext:
        'El principio de la sabiduría es el temor de Jehová (Proverbios 1:7): la primacía de Dios como fundamento de todo conocimiento.',
      messianicTypology:
        'Cristo es el Reshit supremo: el Principio de la creación de Dios (Apocalipsis 3:14) y las Primicias de la resurrección (1 Corintios 15:20, Colosenses 1:18).',
    },
  },

  // =========================================================================
  // RAÍZ: ר-ע-ה (r-'-h) -> H7462 (Ra'ah)
  // =========================================================================
  {
    id: 'root-rh',
    root: 'ר-ע-ה',
    rootTransliteration: "r-'-h",
    strongPrimary: 'H7462',
    lemma: 'רָעָה',
    language: 'Hebreo',
    partOfSpeech: 'Verbo',
    gloss: 'Pastorear, apacentar, cuidar, alimentar con ternura y protección real',
    occurrences: 173,
    cognates: [
      "Acadio: re'û (pastorear, gobernar)",
      "Ugarítico: r'y (pastor, cuidar)",
      'Arameo: רְעָא (apacentar, deleitarse)',
      "Árabe: ra'a (guardar, apacentar el rebaño)",
    ],
    derivedWords: [
      {
        strong: 'H7462',
        wordHebrew: 'רֹעֶה',
        transliteration: "ro'eh",
        partOfSpeech: 'Participio activo / Sustantivo',
        gloss: 'Pastor (Salmos 23:1, Génesis 48:15)',
        occurrences: 64,
      },
      {
        strong: 'H4829',
        wordHebrew: 'מִרְעֶה',
        transliteration: 'mir\'eh',
        partOfSpeech: 'Sustantivo masculino',
        gloss: 'Pasto, dehesa de pastoreo (Génesis 47:4, Ezequiel 34:14)',
        occurrences: 12,
      },
      {
        strong: 'H4830',
        wordHebrew: 'מַרְעִית',
        transliteration: "mar'it",
        partOfSpeech: 'Sustantivo femenino',
        gloss: 'Rebaño del pastizal, grey bajo cuidado (Salmos 79:13, Jeremías 23:1)',
        occurrences: 10,
      },
    ],
    bdb: {
      rootEtymology:
        'Alimentar, conducir al pasto y defender del depredador. En el Antiguo Oriente Próximo, el pastor era el título regio por excelencia de los monarcas justos.',
      sections: [
        {
          number: '1',
          stem: 'Qal',
          definition:
            'Apacentar un rebaño de ovejas/cabras, conducirlos al agua y a la hierba fresca.',
          biblicalRefs: ['Génesis 29:7', 'Génesis 37:2', 'Éxodo 3:1', '1 Samuel 16:11'],
        },
        {
          number: '2',
          stem: 'Qal (Uso Teológico)',
          definition:
            'Dios como Pastor personal de su pueblo y del creyente individual.',
          biblicalRefs: ['Génesis 48:15', 'Génesis 49:24', 'Salmos 23:1', 'Salmos 80:1', 'Isaías 40:11'],
        },
        {
          number: '3',
          stem: 'Piel / Hiphil',
          definition:
            'Alimentarse vorazmente o devastar una región consumiendo los recursos.',
          biblicalRefs: ['Miqueas 5:6', 'Jeremías 6:3'],
        },
      ],
    },
    gesenius: {
      philologicalNotes:
        'Gesenius vincula esta raíz con la idea de compañía íntima y amistad (רֵעַ - compañero). El pastor no es un capataz distante, sino el amigo cercano y proveedor.',
      derivationDiscussion:
        'La doble vertiente de la raíz abarca el alimento material de la hierba y la alimentación espiritual del alma humana.',
      grammaticalForms: [
        'Qal Participio ms con sufijo 1s: רֹעִי (ro\'i - mi pastor)',
        'Qal Imperfecto 3ms con sufijo 1s: יִרְעֵנִי (yir\'eni - él me pastoreará)',
      ],
    },
    dtat: {
      theologicalConcept:
        'La metáfora de YHWH Ro\'i (Jehová mi Pastor) desmantela la pretensión de los reyes de la tierra: Dios mismo desciende al desierto para cargar a los corderos en su regazo.',
      covenantContext:
        'Ezequiel 34 pronuncia juicio sobre los falsos pastores y promete que Dios mismo buscará a sus ovejas dispersas.',
      messianicTypology:
        'Se cumple en Jesucristo, el Buen Pastor (Juan 10:11), el Gran Pastor resucitado (Hebreos 13:20) y el Príncipe de los Pastores (1 Pedro 5:4).',
    },
  },

  // =========================================================================
  // RAÍZ: מ-ל-ך (m-l-k) -> H4427 (Malak) & H4428 (Melek)
  // =========================================================================
  {
    id: 'root-mlk',
    root: 'מ-ל-ך',
    rootTransliteration: 'm-l-k',
    strongPrimary: 'H4428',
    lemma: 'מֶלֶךְ',
    language: 'Hebreo',
    partOfSpeech: 'Sustantivo masculino / Verbo',
    gloss: 'Rey, soberano, reinar con autoridad y juicio supremo',
    occurrences: 2530,
    cognates: [
      'Ugarítico: mlk (rey)',
      'Acadio: malku / maliku (príncipe, consejero)',
      'Arameo bíblico: מַלְכָּא (malka - el rey)',
      'Árabe: malik (rey, poseedor del dominio)',
    ],
    derivedWords: [
      {
        strong: 'H4428',
        wordHebrew: 'מֶלֶךְ',
        transliteration: 'melek',
        partOfSpeech: 'Sustantivo masculino',
        gloss: 'Rey, monarca soberano (Salmos 2:6, Salmos 24:7)',
        occurrences: 2530,
      },
      {
        strong: 'H4427',
        wordHebrew: 'מָלַךְ',
        transliteration: 'malak',
        partOfSpeech: 'Verbo Qal',
        gloss: 'Reinar, asumir el trono (Salmos 93:1, Salmos 97:1)',
        occurrences: 350,
      },
      {
        strong: 'H4438',
        wordHebrew: 'מַלְכוּת',
        transliteration: 'malkut',
        partOfSpeech: 'Sustantivo femenino',
        gloss: 'Reino, dominio soberano, reinado (Salmos 145:11, Daniel 2:44)',
        occurrences: 91,
      },
    ],
    bdb: {
      rootEtymology:
        'Ostentar la potestad soberana y legislar sobre un pueblo. En la teocracia hebrea, el rey humano era solo virrey subordinado al verdadero Rey, YHWH.',
      sections: [
        {
          number: '1',
          definition: 'Reinar sobre un territorio, asumir las riendas del gobierno.',
          biblicalRefs: ['1 Samuel 8:7', '2 Samuel 5:4', '1 Reyes 1:11'],
        },
        {
          number: '2',
          definition: 'Proclamación litúrgica del reinado cósmico de Dios (Salmos de entronización).',
          biblicalRefs: ['Salmos 47:8', 'Salmos 93:1', 'Salmos 96:10', 'Salmos 99:1', 'Isaías 52:7'],
        },
      ],
    },
    gesenius: {
      philologicalNotes:
        'Gesenius destaca la correlación entre la noción de gobernar y la de dar consejo deliberado y sabio (acadio malāku).',
      derivationDiscussion:
        'En arameo (Daniel 2:44, 4:3) מַלְכוּתָא adquiere la dimensión escatológica del Reino que nunca jamás será destruido.',
      grammaticalForms: [
        'Qal Perfecto: מָלַךְ (malak - reinó)',
        'Hiphil: הִמְלִיךְ (himlik - hizo rey, coronó)',
        'Arameo enfático: מַלְכָּא (malka - oh rey)',
      ],
    },
    dtat: {
      theologicalConcept:
        'YHWH Malak («¡Jehová reina!») es el grito de victoria cósmica que aplasta a los ídolos y asegura la justicia para los oprimidos.',
      covenantContext:
        'El pacto davídico (2 Samuel 7) establece que el trono de David será afirmado para siempre.',
      messianicTypology:
        'Apunta directamente a Jesucristo como Rey de reyes y Señor de señores (Apocalipsis 19:16, Lucas 1:32-33).',
    },
  },
];
