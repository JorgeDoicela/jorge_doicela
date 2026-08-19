import { GreekLexiconEntry } from '../types';

export const GREEK_LEXICONS_DATABASE: GreekLexiconEntry[] = [
  // =========================================================================
  // LEMA: λόγος (Logos) -> G3056
  // =========================================================================
  {
    id: 'lemma-logos',
    strong: 'G3056',
    lemma: 'λόγος',
    transliteration: 'logos',
    ipa: '/ló.ɡos/',
    partOfSpeech: 'Sustantivo masculino',
    gloss: 'Palabra, Verbo divino encarnado, razón divina, discurso inteligible, mensaje revelado',
    occurrences: 330,
    rootOrOrigin: 'De G3004 (λέγω - lego, decir, hablar con propósito inteligible)',
    thayer: {
      primaryMeaning:
        'Una palabra articulada por una voz humana que encarna un concepto de la mente; y en Juan 1:1, la Segunda Persona de la Trinidad, la Revelación personal y viva de Dios Padre.',
      senses: [
        {
          number: 'I',
          heading: 'La Palabra como Expresión y Comunicación Racional',
          details:
            'Una declaración, dicho, mandato o enseñanza moral comunicada con claridad mental.',
          biblicalRefs: ['Mateo 7:24', 'Lucas 4:32', '1 Corintios 2:4'],
        },
        {
          number: 'II',
          heading: 'El Mensaje de Salvación (El Evangelio Revelado)',
          details:
            'La doctrina divina revelada: «el mensaje de la cruz» (ὁ λόγος ὁ τοῦ σταυροῦ), «la palabra de verdad».',
          biblicalRefs: ['1 Corintios 1:18', '2 Corintios 5:19', 'Colosenses 1:5', 'Santiago 1:22'],
        },
        {
          number: 'III',
          heading: 'El Verbo Personal y Eterno (Uso Teológico Joánico)',
          details:
            'El Hijo eterno y preexistente de Dios, mediante el cual todas las cosas fueron creadas y quien se hizo carne para habitar entre los hombres.',
          biblicalRefs: ['Juan 1:1', 'Juan 1:14', '1 Juan 1:1', 'Apocalipsis 19:13'],
        },
      ],
      prepositionalUsage:
        'En Juan 1:1, la frase «πρὸς τὸν θεόν» (hacia Dios) denota comunión íntima cara a cara y distinción personal en el seno de la deidad.',
    },
    lsj: {
      classicalUsage:
        'En Heráclito y la filosofía estoica, el Logos era el principio cósmico racional impersonal que gobierna el universo. En Platón y Aristóteles, designa el argumento racional, la proporción matemática y el discurso lógico.',
      septuagintUsage:
        'En la LXX traduce frecuentemente דָּבָר (dabar), la palabra dinámica creadora y profética de YHWH («Por la palabra de Jehová fueron hechos los cielos», Salmo 33:6).',
      papyriContext:
        'En los papiros de oxirrinco del siglo I, logos se utiliza con frecuencia para cuentas financieras rendidas («dar cuenta de», Mateo 12:36), convenios comerciales y decretos imperiales.',
    },
    robertson: {
      keyPassages: [
        {
          verseRef: 'Juan 1:1',
          grammaticalExegesis:
            '«Ἐν ἀρχῇ ἦν ὁ λόγος»: El imperfecto ἦν (era) denota existencia continua y sin principio, en contraste con el aoristo ἐγένετο (llegó a ser) del v. 14. Cuando el tiempo comenzó, el Logos ya existía inmemorialmente.',
          historicalInsight:
            'Juan no toma prestado el concepto de Filón de Alejandría ni del gnosticismo, sino de la revelación del Antiguo Testamento (el Memra arameo y el Dabar hebreo) elevado a Persona divina encarnada.',
        },
        {
          verseRef: 'Juan 1:14',
          grammaticalExegesis:
            '«Καὶ ὁ λόγος σὰρξ ἐγένετο»: El Aoristo ἐγένετο marca el acontecimiento histórico e irreversible de la Encarnación. Asumió la naturaleza humana sin dejar de ser Dios.',
          historicalInsight:
            'Golpe letal al docetismo temprano que negaba la humanidad corpórea y real de Jesús.',
        },
      ],
    },
    vincent: {
      wordStudies: [
        {
          verseRef: 'Juan 1:1',
          pictorialMetaphor:
            'El Logos es el pensamiento interior que se vuelve audible y visible. Lo que el habla es al pensamiento secreto del hombre, el Verbo es al Dios invisible: su perfecta expresión e imagen.',
          culturalContext:
            'Para el lector judío evocaba el Génesis creador; para el lector griego evocaba el sentido supremo de la existencia.',
        },
        {
          verseRef: 'Juan 1:14',
          pictorialMetaphor:
            '«Ἐσκήνωσεν ἐν ἡμῖν»: Levantó su tienda de campaña o tabernáculo en medio de nuestra fragilidad humana, remitiendo a la Gloria Shejiná del Éxodo.',
          culturalContext:
            'La gloria visible de Dios que moraba en el Tabernáculo del desierto ahora habita en la persona visible de Jesús.',
        },
      ],
    },
  },

  // =========================================================================
  // LEMA: ἀρχή (Arche) -> G746
  // =========================================================================
  {
    id: 'lemma-arche',
    strong: 'G746',
    lemma: 'ἀρχή',
    transliteration: 'archē',
    ipa: '/ar.kʰɛ̌ː/',
    partOfSpeech: 'Sustantivo femenino',
    gloss: 'Principio, origen, causa primordial, gobierno, principado con autoridad',
    occurrences: 55,
    rootOrOrigin: 'De G756 (ἄρχομαι - comenzar, gobernar)',
    thayer: {
      primaryMeaning:
        'El punto inicial en el orden temporal o lógico; también la supremacía y la dignidad del que tiene la primera posición.',
      senses: [
        {
          number: '1',
          heading: 'Origen y Comienzo Temporal',
          details: 'El arranque absoluto del cosmos o el inicio del ministerio evangélico.',
          biblicalRefs: ['Mateo 19:4', 'Juan 1:1', 'Hebreos 1:10', '1 Juan 1:1'],
        },
        {
          number: '2',
          heading: 'Causa Primera y Origen Activo',
          details: 'Aquel por medio de quien algo comienza o es originado.',
          biblicalRefs: ['Colosenses 1:18', 'Apocalipsis 3:14', 'Apocalipsis 21:6'],
        },
        {
          number: '3',
          heading: 'Principado, Poder y Autoridad Cósmica',
          details: 'Jerarquías de gobernantes humanos o potestades angélicas/demoniacas.',
          biblicalRefs: ['Lucas 20:20', 'Romanos 8:38', 'Efesios 1:21', 'Colosenses 1:16'],
        },
      ],
    },
    lsj: {
      classicalUsage:
        'En los filósofos presocráticos (Tales, Anaximandro, Anaxímenes), arché era la materia primordial o principio generador de todas las cosas. En la política griega, designaba la magistratura suprema (el arconte).',
      septuagintUsage: 'Traduce רֵאשִׁית (reshit) en Génesis 1:1 («Ἐν ἀρχῇ ἐποίησεν ὁ θεός»).',
      papyriContext: 'Se usaba en documentos oficiales para datar el inicio de un reinado o mandato judicial.',
    },
    robertson: {
      keyPassages: [
        {
          verseRef: 'Colosenses 1:18',
          grammaticalExegesis:
            '«Ὅς ἐστιν ἀρχή»: Cristo no es solo el primero en tiempo, sino la Fuente y Causa eficiente de la resurrección de entre los muertos.',
          historicalInsight:
            'Pablo refuta las herejías gnósticas tempranas en Colosas que subordinaban a Cristo a una serie de emanaciones angélicas.',
        },
      ],
    },
    vincent: {
      wordStudies: [
        {
          verseRef: 'Apocalipsis 3:14',
          pictorialMetaphor:
            '«Ἡ ἀρχὴ τῆς κτίσεως τοῦ θεοῦ»: No significa la primera criatura creada, sino el Soberano Originador y Manantial de donde brota toda la creación.',
          culturalContext: 'Afirma la preeminencia cósmica del Señor resucitado sobre el universo.',
        },
      ],
    },
  },

  // =========================================================================
  // LEMA: ἀγάπη (Agape) -> G26 & ἀγαπάω (G25)
  // =========================================================================
  {
    id: 'lemma-agape',
    strong: 'G26',
    lemma: 'ἀγάπη',
    transliteration: 'agapē',
    ipa: '/a.ɡá.pɛː/',
    partOfSpeech: 'Sustantivo femenino',
    gloss: 'Amor divino, incondicional, sacrificial y voluntario; benevolencia soberana',
    occurrences: 116,
    rootOrOrigin: 'De G25 (ἀγαπάω - agapao, amar con voluntad reflexiva y entrega deliberada)',
    thayer: {
      primaryMeaning:
        'El amor más noble y sublime: no nacido del impulso ciego o de la pasión física (eros), ni de la afinidad meramente emocional (philia), sino de la elección deliberada de buscar el bien eterno del objeto amado.',
      senses: [
        {
          number: '1',
          heading: 'El Amor Esencial de Dios hacia el Hombre',
          details: 'La entrega de su Hijo unigénito en la cruz como muestra inmutable de amor soberano.',
          biblicalRefs: ['Romanos 5:8', '1 Juan 4:8', '1 Juan 4:10', 'Efesios 2:4'],
        },
        {
          number: '2',
          heading: 'El Amor Fraternal Cristiano',
          details: 'El fruto supremo del Espíritu Santo que une a la iglesia en perfección ética.',
          biblicalRefs: ['1 Corintios 13:1-13', 'Gálatas 5:22', 'Colosenses 3:14', '1 Pedro 4:8'],
        },
      ],
    },
    lsj: {
      classicalUsage:
        'Prácticamente ausente en la literatura clásica pagana, que prefería eros (deseo apasionado) o philia (amistad leal). El cristianismo tomó este vocablo raro y lo elevó a ser la palabra suprema de la revelación divina.',
      septuagintUsage: 'Traduce אַהֲבָה (ahavah) en el Cantar de los Cantares y los Profetas.',
      papyriContext: 'En cartas cristianas tempranas se utilizaba también para designar la «Fiesta de Amor» (ágape / cena comunitaria compartida).',
    },
    robertson: {
      keyPassages: [
        {
          verseRef: '1 Juan 4:8',
          grammaticalExegesis:
            '«Ὁ θεὸς ἀγάπη ἐστίν»: Dios no es simplemente un ser amoroso; el amor es su esencia misma. El predicado nominal carece de artículo, indicando cualidad inherente del carácter divino.',
          historicalInsight:
            'La más alta cumbre de la revelación teológica del Nuevo Testamento.',
        },
      ],
    },
    vincent: {
      wordStudies: [
        {
          verseRef: '1 Corintios 13:4',
          pictorialMetaphor:
            'El ágape no es un sentimiento efímero sino un ejército de virtudes activas: es paciente, sufre largo tiempo sin amargura y jamás busca lo suyo propio.',
          culturalContext: 'Contrasta con la obsesión corintia por los dones carismáticos espectaculares.',
        },
      ],
    },
  },

  // =========================================================================
  // LEMA: κατάκριμα (Katakrima) -> G2631
  // =========================================================================
  {
    id: 'lemma-katakrima',
    strong: 'G2631',
    lemma: 'κατάκριμα',
    transliteration: 'katakrima',
    ipa: '/ka.tá.kri.ma/',
    partOfSpeech: 'Sustantivo neutro',
    gloss: 'Condenación judicial, veredicto de culpabilidad con su consiguiente ejecución punitiva',
    occurrences: 3,
    rootOrOrigin: 'De G2632 (κατακρίνω - juzgar en contra, sentenciar con castigo)',
    thayer: {
      primaryMeaning:
        'El veredicto condenatorio emitido por un tribunal con autoridad y el castigo o penalidad que dicho veredicto impone.',
      senses: [
        {
          number: '1',
          heading: 'Sentencia Penal y Condenación Judicial Absoluta',
          details: 'La condenación resultante del pecado de Adán (Rom 5:16, 18) y la anulación total de ella en Cristo (Rom 8:1).',
          biblicalRefs: ['Romanos 5:16', 'Romanos 5:18', 'Romanos 8:1'],
        },
      ],
    },
    lsj: {
      classicalUsage: 'Término estrictamente forense y judicial para el castigo penal impuesto tras el juicio.',
      septuagintUsage: 'Raramente usado en LXX, pero refleja la vindicación de la justicia estricta de la Ley.',
      papyriContext: 'En los papiros legales greco-egipcios, katakrima designaba la servidumbre legal impuesta o la confiscación forzosa por deuda o delito.',
    },
    robertson: {
      keyPassages: [
        {
          verseRef: 'Romanos 8:1',
          grammaticalExegesis:
            '«Οὐδὲν ἄρα νῦν κατάκριμα»: El sufijo -μα denota el resultado del juicio penal. No queda vestigio de condenación, ni en la sentencia ni en el castigo ejecutorio.',
          historicalInsight:
            'El creyente justificado está completamente protegido del tribunal condenatorio de Dios porque la sentencia cayó sobre Cristo en la cruz.',
        },
      ],
    },
    vincent: {
      wordStudies: [
        {
          verseRef: 'Romanos 8:1',
          pictorialMetaphor:
            'El juicio ha terminado, el tribunal se ha puesto en pie y el acta de acusación ha sido archivada para siempre: el reo ha sido absuelto irrevocablemente.',
          culturalContext: 'Alusión al sistema judicial imperial romano de apelaciones inmutables.',
        },
      ],
    },
  },
];
