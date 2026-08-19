import { ChiasmStructure } from '../types';

export const POETIC_STRUCTURES_DATABASE: ChiasmStructure[] = [
  // =========================================================================
  // SALMO 67: EL QUIASMO SEPTENARIO PERFECTO (A - B - C - D - C' - B' - A')
  // =========================================================================
  {
    id: 'psalm-67',
    bookAbbreviation: 'SAL',
    bookName: 'Salmos',
    passageRef: 'Salmos 67:1-7',
    title: 'La Bendición Misionera y la Alabanza Universal de las Naciones',
    literaryCategory: 'Salmos',
    description:
      'El Salmo 67 es el modelo canónico clásico de un quiasmo concéntrico perfecto de 7 elementos. El centro geométrico y teológico (versículo 4) proclama el gozo de todas las naciones bajo el gobierno justo de Dios.',
    focalMessage:
      'El centro del quiasmo (Elemento D - v. 4) revela el propósito supremo de la bendición sacerdotal a Israel: no el orgullo nacional, sino el gozo y la salvación de todos los pueblos de la tierra bajo el reino justo de Dios.',
    cola: [
      {
        id: 'ps-67-A',
        label: 'A',
        matchingPairId: "ps-67-A'",
        verseRef: 'Salmo 67:1',
        textSpanish: 'Dios tenga misericordia de nosotros, y nos bendiga; haga resplandecer su rostro sobre nosotros; (Selah)',
        textHebrew: 'אֱלֹהִ֗ים יְחָנֵּ֥נוּ וִיבָרְכֵ֑נוּ יָ֤אֵֽר פָּנָ֖יו אִתָּ֣נוּ סֶֽלָה׃',
        parallelismType: 'synonymous',
        theologicalNote: 'Petición inicial de bendición sacerdotal a Israel (eco de Números 6:24-26).',
      },
      {
        id: 'ps-67-B',
        label: 'B',
        matchingPairId: "ps-67-B'",
        verseRef: 'Salmo 67:2',
        textSpanish: 'Para que sea conocido en la tierra tu camino, en todas las naciones tu salvación.',
        textHebrew: 'לָדַ֣עַת בָּאָ֣רֶץ דַּרְכֶּ֑ךָ בְּכָל־גּ֝וֹיִ֗ם יְשׁוּעָתֶֽךָ׃',
        parallelismType: 'synonymous',
        theologicalNote: 'Propósito salvífico universal: el conocimiento de Dios en todas las naciones gentiles.',
      },
      {
        id: 'ps-67-C',
        label: 'C',
        matchingPairId: "ps-67-C'",
        verseRef: 'Salmo 67:3',
        textSpanish: 'Te alaben los pueblos, oh Dios; todos los pueblos te alaben.',
        textHebrew: 'יוֹד֭וּךָ עַמִּ֥ים ׀ אֱלֹהִ֑ים י֝וֹד֗וּךָ עַמִּ֥ים כֻּלָּֽם׃',
        parallelismType: 'climactic',
        theologicalNote: 'Estribillo coral 1: Convocatoria a la alabanza universal.',
      },
      {
        id: 'ps-67-D',
        label: 'D (CENTRO FOCAL / CLÍMAX)',
        verseRef: 'Salmo 67:4',
        textSpanish: 'Alégrense y gocense las naciones, porque juzgarás los pueblos con equidad, y pastorearás las naciones en la tierra. (Selah)',
        textHebrew: 'יִ֥שְׂמְח֥וּ וִירַנְּנ֗וּ לְאֻ֫מִּ֥ים כִּֽי־תִשְׁפֹּ֣ט עַמִּ֣ים מִישֹׁ֑ר וּלְאֻמִּ֓ים ׀ בָּאָ֖רֶץ תַּנְחֵ֣ם סֶֽלָה׃',
        isFocalCenter: true,
        parallelismType: 'introverted_chiasm',
        theologicalNote: 'NÚCLEO TEOLÓGICO: El reinado de Dios produce gozo en los pueblos gentiles mediante su justicia y pastoreo soberano.',
      },
      {
        id: "ps-67-C'",
        label: "C'",
        matchingPairId: 'ps-67-C',
        verseRef: 'Salmo 67:5',
        textSpanish: 'Te alaben los pueblos, oh Dios; todos los pueblos te alaben.',
        textHebrew: 'יוֹד֭וּךָ עַמִּ֥ים אֱלֹהִ֑ים י֝וֹד֗וּךָ עַמִּ֥ים כֻּלָּֽם׃',
        parallelismType: 'climactic',
        theologicalNote: 'Estribillo coral 2: Eco simétrico exacto de C reforzando la proclamación.',
      },
      {
        id: "ps-67-B'",
        label: "B'",
        matchingPairId: 'ps-67-B',
        verseRef: 'Salmo 67:6',
        textSpanish: 'La tierra dará su fruto; nos bendecirá el Dios, el Dios nuestro.',
        textHebrew: 'אֶ֭רֶץ נָתְנָ֣ה יְבוּלָ֑הּ יְ֝בָרְכֵ֗נוּ אֱלֹהִ֥ים אֱלֹהֵֽינוּ׃',
        parallelismType: 'synthetic',
        theologicalNote: 'Fruto terrenal y cumplimiento físico de la bendición pactual anunciada en B.',
      },
      {
        id: "ps-67-A'",
        label: "A'",
        matchingPairId: 'ps-67-A',
        verseRef: 'Salmo 67:7',
        textSpanish: 'Bendíganos Dios, y témanlo todos los términos de la tierra.',
        textHebrew: 'יְבָרְכֵ֥נוּ אֱלֹהִ֑ים וְיִֽירְא֥וּ אוֹ֝ת֗וֹ כָּל־אַפְסֵי־אָֽרֶץ׃',
        parallelismType: 'synthetic',
        theologicalNote: 'Culminación simétrica de A: La bendición divina sobre el pueblo resulta en el santo temor en los confines de la tierra.',
      },
    ],
  },

  // =========================================================================
  // SALMO 23: EL QUIASMO DEL PASTOR (A - B - C - D - C' - B' - A')
  // =========================================================================
  {
    id: 'psalm-23',
    bookAbbreviation: 'SAL',
    bookName: 'Salmos',
    passageRef: 'Salmos 23:1-6',
    title: 'El Buen Pastor: De la Provisión Externa a la Comunión Íntima',
    literaryCategory: 'Salmos',
    description:
      'El Salmo 23 transita estructuralmente de la tercera persona («Él me hace descansar») a la segunda persona íntima («Tú estás conmigo») en el centro mismo del valle de sombra de muerte.',
    focalMessage:
      'El centro del quiasmo (Elemento D - v. 4b: «Porque tú estarás conmigo») marca el giro existencial donde Dios pasa de ser un Pastor del que se habla a una Presencia viva e íntima con quien se habla cara a cara.',
    cola: [
      {
        id: 'ps-23-A',
        label: 'A',
        matchingPairId: "ps-23-A'",
        verseRef: 'Salmo 23:1',
        textSpanish: 'Jehová es mi pastor; nada me faltará.',
        textHebrew: 'יְהוָ֥ה רֹ֝עִ֗י לֹ֣א אֶחְסָֽר׃',
        parallelismType: 'synthetic',
        theologicalNote: 'Declaración general de confianza plena en YHWH como Pastor.',
      },
      {
        id: 'ps-23-B',
        label: 'B',
        matchingPairId: "ps-23-B'",
        verseRef: 'Salmo 23:2-3a',
        textSpanish: 'En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará. Confortará mi alma;',
        textHebrew: 'בִּנְא֬וֹת דֶּ֗שֶׁא יַרְבִּיצֵ֑נִי עַל־מֵ֖י מְנֻח֣וֹת יְנַהֲלֵֽנִי׃ נַפְשִׁ֥י יְשׁוֹבֵ֑ב',
        parallelismType: 'synonymous',
        theologicalNote: 'Provisión terrenal: pastos verdes, aguas tranquilas y restauración.',
      },
      {
        id: 'ps-23-C',
        label: 'C',
        matchingPairId: "ps-23-C'",
        verseRef: 'Salmo 23:3b-4a',
        textSpanish: 'Me guiará por sendas de justicia por amor de su nombre. Aunque ande en valle de sombra de muerte, no temeré mal alguno,',
        textHebrew: 'יַֽנְחֵ֥נִי בְמַעְגְּלֵי־צֶ֝֗דֶק לְמַ֣עַן שְׁמֽוֹ׃ גַּ֤ם כִּֽי־אֵלֵ֨ךְ בְּגֵ֪יא צַלְמָ֡וֶת לֹא־אִ֘ירָ֤א רָ֗ע',
        parallelismType: 'synthetic',
        theologicalNote: 'Caminar por senderos peligrosos bajo la fidelidad del Nombre sagrado.',
      },
      {
        id: 'ps-23-D',
        label: 'D (CENTRO FOCAL)',
        verseRef: 'Salmo 23:4b',
        textSpanish: 'porque tú estarás conmigo; tu vara y tu cayado me infundirán aliento.',
        textHebrew: 'כִּי־אַתָּ֥ה עִמָּדִ֑י שִׁבְטְךָ֥ וּ֝מִשְׁעַנְתֶּ֗ךָ הֵ֣מָּה יְנַֽחֲמֻֽנִי׃',
        isFocalCenter: true,
        parallelismType: 'introverted_chiasm',
        theologicalNote: 'EL CLÍMAX: Cambio gramatical a segunda persona (Tú conmigo) en medio de la máxima oscuridad.',
      },
      {
        id: "ps-23-C'",
        label: "C'",
        matchingPairId: 'ps-23-C',
        verseRef: 'Salmo 23:5a',
        textSpanish: 'Aderezas mesa delante de mí en presencia de mis angustiadores;',
        textHebrew: 'תַּעֲרֹ֬ךְ לְפָנַ֨י ׀ שֻׁלְחָ֗ן נֶ֥גֶד צֹרְרָ֑י',
        parallelismType: 'synthetic',
        theologicalNote: 'Victoria frente al peligro y a los enemigos bajo la hospitalidad regia de Dios.',
      },
      {
        id: "ps-23-B'",
        label: "B'",
        matchingPairId: 'ps-23-B',
        verseRef: 'Salmo 23:5b',
        textSpanish: 'unges mi cabeza con aceite; mi copa está rebosando.',
        textHebrew: 'דִּשַּׁ֖נְתָּ בַשֶּׁ֥מֶן רֹ֝אשִׁ֗י כּוֹסִ֥י רְוָיָֽה׃',
        parallelismType: 'synonymous',
        theologicalNote: 'Provisión celestial y gozo rebosante (eco simétrico de los pastos verdes).',
      },
      {
        id: "ps-23-A'",
        label: "A'",
        matchingPairId: 'ps-23-A',
        verseRef: 'Salmo 23:6',
        textSpanish: 'Ciertamente el bien y la misericordia me seguirán todos los días de mi vida, y en la casa de Jehová moraré por largos días.',
        textHebrew: 'אַ֤ךְ ׀ ט֤וֹב וָחֶ֣סֶד יִ֭רְדְּפוּנִי כָּל־יְמֵ֣י חַיָּ֑י וְשַׁבְתִּ֥י בְּבֵית־יְ֝הוָ֗ה לְאֹ֣רֶךְ יָמִֽים׃',
        parallelismType: 'synthetic',
        theologicalNote: 'Declaración final eterna: comunión perpetua en la Casa del Señor (cierre de A).',
      },
    ],
  },

  // =========================================================================
  // SALMO 1: PARALELISMOS ANTITÉTICOS Y SINTÉTICOS (LOS DOS CAMINOS)
  // =========================================================================
  {
    id: 'psalm-1',
    bookAbbreviation: 'SAL',
    bookName: 'Salmos',
    passageRef: 'Salmos 1:1-6',
    title: 'El Árbol Fructífero y el Tamo: La Antítesis de los Dos Caminos',
    literaryCategory: 'Salmos',
    description:
      'El pórtico del Salterio utiliza el paralelismo escalonado en el v. 1 y el paralelismo antitético riguroso entre el justo y el impío (v. 3 vs v. 4 y v. 6).',
    focalMessage:
      'El contraste absoluto de destinos: El justo conoce la bendición de arraigarse en la Torá de Dios como árbol junto a corrientes; el impío es como tamo dispersado por el viento.',
    cola: [
      {
        id: 'ps-1-1',
        label: 'Estrofa 1 (Escalonada)',
        verseRef: 'Salmo 1:1',
        textSpanish: 'Bienaventurado el varón que no anduvo en consejo de malos, ni estuvo en camino de pecadores, ni en silla de escarnecedores se ha sentado;',
        textHebrew: 'אַ֥שְֽׁרֵי־הָאִ֗ישׁ אֲשֶׁ֤ר ׀ לֹ֥א הָלַךְ֮ בַּעֲצַ֪ת רְשָׁ֫עִ֥ים וּבְדֶ֣רֶךְ חַ֭טָּאִים לֹ֥א עָמָ֑ד וּבְמוֹשַׁ֥ב לֵ֝צִ֗ים לֹ֣א יָשָֽׁב׃',
        parallelismType: 'climactic',
        theologicalNote: 'Gradación descendente del pecado: andar -> detenerse -> sentarse / consejo -> camino -> silla.',

      },
      {
        id: 'ps-1-2',
        label: 'Estrofa 2 (Sinónima)',
        verseRef: 'Salmo 1:2',
        textSpanish: 'Sino que en la ley de Jehová está su delicia, y en su ley medita de día y de noche.',
        textHebrew: 'כִּ֤י אִ֥ם בְּתוֹרַ֥ת יְהוָ֗ה חֶ֫פְצ֥וֹ וּֽבְתוֹרָת֥וֹ יֶהְגֶּ֗ה יוֹמָ֥ם וָלָֽיְלָה׃',
        parallelismType: 'synonymous',
        theologicalNote: 'Paralelismo sinónimo: el deleite interior se traduce en la meditación continua de la Torá.',
      },
      {
        id: 'ps-1-3',
        label: 'Estrofa 3 (Sintética / Metáfora)',
        verseRef: 'Salmo 1:3',
        textSpanish: 'Será como árbol plantado junto a corrientes de aguas, que da su fruto en su tiempo, y su hoja no cae; y todo lo que hace, prosperará.',
        textHebrew: 'וְֽהָיָ֗ה כְּעֵץ֮ שָׁת֪וּל עַֽל־פַּלְגֵ֫י מָ֥יִם אֲשֶׁ֤ר פִּרְי֨וֹ ׀ יִתֵּ֬ן בְּעִתּ֗וֹ וְעָלֵ֥הוּ לֹֽא־יִבּ֑וֹל וְכֹ֖ל אֲשֶׁר־יַעֲשֶׂ֣ה יַצְלִֽיחַ׃',
        parallelismType: 'synthetic',
        theologicalNote: 'Símil del árbol vitalmente nutrido que produce fruto continuo y estabilidad.',
      },
      {
        id: 'ps-1-4',
        label: 'Estrofa 4 (Antítesis Total)',
        verseRef: 'Salmo 1:4-5',
        textSpanish: 'No así los malos, que son como el tamo que arrebata el viento. Por tanto, no se levantarán los malos en el juicio, ni los pecadores en la congregación de los justos.',
        textHebrew: 'לֹא־כֵ֥ן הָרְשָׁעִ֑ים כִּ֥י אִם־כַּ֝מֹּ֗ץ אֲֽשֶׁר־תִּדְּפֶ֥נּוּ רֽוּחַ׃',
        parallelismType: 'antithetic',
        theologicalNote: 'Contraste diametral: El impío carece de raíz, peso ontológico y fruto espiritual; es tamo volátil.',
      },
      {
        id: 'ps-1-5',
        label: 'Estrofa 5 (Conclusión Antitética)',
        verseRef: 'Salmo 1:6',
        textSpanish: 'Porque Jehová conoce el camino de los justos; mas la senda de los malos perecerá.',
        textHebrew: 'כִּֽי־יוֹדֵ֣עַ יְ֭הוָה דֶּ֣רֶךְ צַדִּיקִ֑ים וְדֶ֖רֶךְ רְשָׁעִ֣ים תֹּאבֵֽד׃',
        parallelismType: 'antithetic',
        theologicalNote: 'El camino del justo es protegido por el conocimiento pactual de Dios; el del impío conduce a la ruina.',
      },
    ],
  },

  // =========================================================================
  // PROVERBIOS 3:1-12: PARALELISMO DE LA SABIDURÍA Y CONFIANZA
  // =========================================================================
  {
    id: 'prov-3',
    bookAbbreviation: 'PROV',
    bookName: 'Proverbios',
    passageRef: 'Proverbios 3:5-12',
    title: 'La Confianza Absoluta en YHWH: Paralelismo y Exhortación Sapiencial',
    literaryCategory: 'Proverbios',
    description:
      'Proverbios estructura sus exhortaciones en dísticos (pareados) que alternan mandamiento divino y promesa consecuente de dirección.',
    focalMessage:
      'La renuncia a la propia prudencia para rendirse por completo al señorío de Dios garantiza senderos enderezados y salud integral.',
    cola: [
      {
        id: 'pr-3-A',
        label: 'Dístico 1 (Mandato Antitético)',
        verseRef: 'Proverbios 3:5',
        textSpanish: 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.',
        textHebrew: 'בְּטַ֣ח אֶל־יְ֭הוָה בְּכָל־לִבֶּ֑ךָ וְאֶל־בִּֽ֝ינָתְךָ֗ אַל־תִּשָּׁעֵֽן׃',
        parallelismType: 'antithetic',
        theologicalNote: 'Contraste radical entre la fe de corazón en Dios vs la autosuficiencia racional humana.',
      },
      {
        id: 'pr-3-B',
        label: 'Dístico 2 (Sintético / Promesa)',
        verseRef: 'Proverbios 3:6',
        textSpanish: 'Reconócelo en todos tus caminos, y él enderezará tus veredas.',
        textHebrew: 'בְּכָל־דְּרָכֶ֥יךָ דָעֵ֑הוּ וְ֝ה֗וּא יְיַשֵּׁ֥ר אֹֽרְחֹתֶֽיךָ׃',
        parallelismType: 'synthetic',
        theologicalNote: 'El reconocimiento continuo de Dios activa su guía soberana que quita los tropiezos.',
      },
      {
        id: 'pr-3-C',
        label: 'Dístico 3 (Antitético / Sanidad)',
        verseRef: 'Proverbios 3:7-8',
        textSpanish: 'No seas sabio en tu propia opinión; teme a Jehová, y apártate del mal; porque será medicina a tu cuerpo, y refrigerio para tus huesos.',
        textHebrew: 'אַל־תְּהִ֣י חָכָ֣ם בְּעֵינֶ֑יךָ יְרָ֥א אֶת־יְ֝הוָ֗ה וְס֣וּר מֵרָֽע׃ רִ֭פְאוּת תְּהִ֣י לְשָׁרֶּ֑ךָ וְ֝שִׁקּ֗וּי לְעַצְמוֹתֶֽיךָ׃',
        parallelismType: 'synthetic',
        theologicalNote: 'La humildad espiritual y el temor reverente producen salud física, paz y vigor interior.',
      },
    ],
  },
];
