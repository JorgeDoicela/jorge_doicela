import { ArchaeologyArticle } from '../types';

export const ARCHAEOLOGY_ARTICLES: ArchaeologyArticle[] = [
  // --- CATEGORÍA 1: HALLAZGOS RECIENTES EN TIERRA SANTA ---
  {
    id: 'siloam-pool-excavation',
    title: 'Excavación Integral de la Piscina de Siloé y la Calle Escalonada Herodiana',
    slug: 'excavacion-integral-piscina-siloe-calle-escalonada',
    category: 'recent_discoveries',
    region: 'jerusalem_judea',
    regionLabel: 'Jerusalén (Ciudad de David)',
    publishDate: '2025-11-14',
    institutionOrAuthor: 'Israel Antiquities Authority (IAA) / Dr. Ronny Reich & Eli Shukron',
    readTimeMinutes: 6,
    summary:
      'La excavación a gran escala en el extremo sur de la Ciudad de David ha dejado al descubierto la totalidad de la monumental Piscina de Siloé del siglo I, alimentada por el túnel de Ezequías.',
    contentMarkdown: `
### Contexto del Descubrimiento
Las excavaciones continuas en la Ciudad de David han permitido revelar el perímetro completo de la **Piscina de Siloé** (Birket Silwan) construida originalmente en el período del Segundo Templo bajo el reinado de Herodes el Grande. 

La estructura abarca un área trapezoidal de más de 50 metros de longitud con múltiples niveles de escalones de piedra caliza tallada que permitían a cientos de peregrinos sumergirse simultáneamente para su purificación ritual antes de ascender al Monte del Templo.

### Conexión con los Evangelios
Este lugar es el escenario directo del milagro registrado en el Evangelio de Juan, donde Jesús untó lodo en los ojos de un hombre ciego de nacimiento y le ordenó: *"Ve a lavarte en el estanque de Siloé (que traducido es, Enviado). Fue entonces, y se lavó, y regresó viendo"* (Juan 9:7).

### La Calle Escalonada de Peregrinación
Junto a la piscina se ha desenterrado la **Avenida de los Peregrinos**, un bulevar monumental de 600 metros de longitud pavimentado con losas de piedra masivas que conectaba directamente la piscina con las puertas de Hulda en la pared sur del Templo. Los análisis numismáticos hallados bajo el pavimento confirman que la vía fue completada durante la administración del prefecto romano **Poncio Pilato** (c. 30-36 d.C.).
    `,
    biblicalReferences: [
      { reference: 'Juan 9:1-11', context: 'Sanidad milagrosa del ciego de nacimiento en la piscina de Siloé' },
      { reference: 'Nehemías 3:15', context: 'Salum repara el muro del estanque de Siloé junto al huerto del rey' },
      { reference: 'Isaías 8:6', context: 'Las aguas de Siloé que corren mansamente' },
    ],
    epigraphy: {
      originalScript: 'שִׁלֹחַ',
      language: 'Hebreo',
      transliteration: 'Shilóaj',
      translation: 'Enviado / Conducción de aguas',
      dateEstimate: 'Siglo VIII a.C. - Siglo I d.C.',
    },
    museumOrLocation: 'Parque Nacional Ciudad de David (Jerusalén)',
    keyArtifact: 'Escalinatas monumentales y canal de drenaje subterráneo herodiano',
    tags: ['Jerusalén', 'Juan 9', 'Herodes', 'Poncio Pilato', 'Purificación Ritual'],
  },
  {
    id: 'magdala-second-temple-synagogue',
    title: 'La Sinagoga del Siglo I y la Piedra Tallada de Magdala en el Mar de Galilea',
    slug: 'sinagoga-siglo-i-piedra-magdala-galilea',
    category: 'recent_discoveries',
    region: 'galilee_samaria',
    regionLabel: 'Mar de Galilea (Israel)',
    publishDate: '2025-08-20',
    institutionOrAuthor: 'Universidad Anáhuac / Dr. Marcela Zapata-Meza & IAA',
    readTimeMinutes: 5,
    summary:
      'Descubrimiento de dos sinagogas activas durante el ministerio de Jesús en la ciudad de Magdala, incluyendo la célebre Piedra de Magdala con la representación más antigua conocida de la Menorá del Templo.',
    contentMarkdown: `
### Hallazgo de la Sinagoga Primitiva
Durante excavaciones preventivas en la costa occidental del Mar de Galilea, los arqueólogos desenterraron una sinagoga del período del Segundo Templo decorada con frescos polícromos, bancos de piedra adosados a los muros y un piso de mosaico geométrico.

Dado que Jesús *"recorría toda Galilea, enseñando en las sinagogas de ellos, y predicando el evangelio del reino"* (Mateo 4:23), es históricamente certero que este recinto fue visitado y utilizado por Jesús y sus primeros discípulos.

### La Enigmática Piedra de Magdala
En el centro de la nave principal se descubrió un bloque de piedra caliza esculpido con un relieve tridimensional que representa el mobiliario del Templo de Jerusalén cuando aún estaba en pie:
1. **La Menorá de 7 brazos:** La representación sinagogal más antigua hallada en Galilea.
2. **La Mesa de los Panes de la Proposición:** Con vasijas y jarras rituales.
3. **El Carro de Fuego:** Alusiones a las visiones proféticas de la gloria divina.
    `,
    biblicalReferences: [
      { reference: 'Mateo 4:23', context: 'Jesús enseña en las sinagogas de toda Galilea' },
      { reference: 'Lucas 8:1-3', context: 'María Magdalena y las mujeres que servían a Jesús con sus bienes' },
      { reference: 'Marcos 16:9', context: 'Aparición de Jesús resucitado a María Magdalena' },
    ],
    museumOrLocation: 'Sitio Arqueológico de Magdala (Migdal)',
    keyArtifact: 'La Piedra Tallada de Magdala con la Menorá de 7 brazos',
    tags: ['Galilea', 'Magdala', 'Sinagogas', 'Menorá', 'Evangelios'],
  },

  // --- CATEGORÍA 2: MANUSCRITOS DEL MAR MUERTO Y EPIGRAFÍA ---
  {
    id: 'dead-sea-scrolls-isaiah-1qisa',
    title: 'El Gran Rollo de Isaías (1QIsa) de Qumrán y la Fidelidad Textual del Canon',
    slug: 'gran-rollo-isaias-qumran-fidelidad-textual',
    category: 'manuscripts_epigraphy',
    region: 'jordan_dead_sea',
    regionLabel: 'Qumrán (Mar Muerto)',
    publishDate: '2025-06-10',
    institutionOrAuthor: 'Santuario del Libro / Museo de Israel / Dr. Adolfo Roitman',
    readTimeMinutes: 8,
    summary:
      'Análisis paleográfico y comparativo del manuscrito bíblico completo más antiguo del mundo: los 66 capítulos de Isaías fechados en el siglo II a.C., confirmando la asombrosa preservación del Texto Masorético.',
    contentMarkdown: `
### El Descubrimiento en la Cueva 1
En 1947, pastores beduinos descubrieron en una cueva cerca de las costas noroccidentales del Mar Muerto una serie de tinajas de cerámica que contenían rollos de pergamino de cuero cosido. Entre ellos, el más notable fue el **Gran Rollo de Isaías (1QIsa)**, preservado intacto a lo largo de 7.34 metros de longitud distribuidos en 54 columnas de texto en paleohebreo/hebreo cuadrado.

### Impacto en la Crítica Textual Bíblica
Antes de 1947, el manuscrito en hebreo más antiguo de la Biblia disponible para los eruditos era el *Códice de Alepo* (c. 920 d.C.) y el *Códice de Leningrado* (1008 d.C.).

El Rollo 1QIsa permitió dar un salto retrospectivo de más de **1,100 años hacia el pasado** (fechado c. 125 a.C. mediante datación por carbono-14 y análisis paleográfico). Al comparar palabra por palabra el texto de Isaías 53 (el Siervo Sufriente) entre 1QIsa y el Texto Masorético tradicional medieval, se constató una coincidencia superior al **95%**, siendo las mínimas discrepancias meras variantes ortográficas o letras vocálicas plenas (*matres lectionis*).

### Conclusión Erudita
El hallazgo demostró científicamente que el texto sagrado del Antiguo Testamento no sufrió corrupciones dogmáticas ni transformaciones mitológicas a lo largo de más de un milenio de copiado manual por los escribas soferim.
    `,
    biblicalReferences: [
      { reference: 'Isaías 40:8', context: 'Sécase la hierba, marchítase la flor; mas la palabra del Dios nuestro permanece para siempre' },
      { reference: 'Isaías 53:1-12', context: 'Cántico profético del Siervo de Yahvé que cargó con nuestros dolores' },
      { reference: 'Lucas 4:17-21', context: 'Jesús desenrolla el libro del profeta Isaías en Nazaret' },
    ],
    epigraphy: {
      originalScript: 'אָכֵן חֳלָיֵנוּ הוּא נָשָׂא וּמַכְאֹבֵינוּ סְבָלָם',
      language: 'Hebreo Bíblico',
      transliteration: 'Ajen jolayenu hu nasa umak\'ovenu sevalam',
      translation: 'Ciertamente llevó él nuestras enfermedades, y sufrió nuestros dolores (Isaías 53:4 en 1QIsa)',
      dateEstimate: 'c. 125 a.C.',
    },
    museumOrLocation: 'Santuario del Libro (Museo de Israel, Jerusalén)',
    keyArtifact: 'Manuscrito de pergamino 1QIsa (Rollo de Isaías)',
    tags: ['Qumrán', 'Isaías', 'Manuscritos', 'Crítica Textual', 'Apologética'],
  },
  {
    id: 'ketef-hinnom-silver-scrolls',
    title: 'Los Amuletos de Plata de Ketef Hinnom: La Cita Bíblica más Antigua de la Historia',
    slug: 'amuletos-plata-ketef-hinnom-bendicion-sacerdotal',
    category: 'manuscripts_epigraphy',
    region: 'jerusalem_judea',
    regionLabel: 'Jerusalén (Valle de Hinom)',
    publishDate: '2025-03-05',
    institutionOrAuthor: 'Universidad de Tel Aviv / Dr. Gabriel Barkay',
    readTimeMinutes: 6,
    summary:
      'Dos diminutos rollos de lámina de plata del siglo VII a.C. desenterrados en una tumba de Jerusalén contienen la Bendición Sacerdotal de Números 6:24-26 y el nombre divino YHWH, refutando las teorías de redacción tardía de la Torá.',
    contentMarkdown: `
### El Descubrimiento en la Cueva Funeraria
En 1979, durante la excavación de una tumba familiar del período del Primer Templo en la ladera de Ketef Hinnom (con vista al Monte Sion y al valle de Gehena), se encontró una cámara sellada intacta con más de 1,000 objetos de cerámica y joyas.

Entre ellos sobresalían dos pequeños rollos cilíndricos de plata pura (Amuletos KH1 y KH2) de apenas 2.7 y 1.1 cm de tamaño enrollados apretadamente.

### Desenrolle Tecnológico y Lectura
Tras tres años de minucioso trabajo en los laboratorios del Museo de Israel, las láminas fueron desenrolladas microscópicamente, revelando un texto grabado con un estilete metálico en alfabeto paleohebreo arcaico:

> *"Jehová te bendiga, y te guarde; Jehová haga resplandecer su rostro sobre ti, y tenga de ti misericordia; Jehová alce sobre ti su rostro, y ponga en ti paz"* (Números 6:24-26).

### Trascendencia Teológica
Fechados de forma unánime en el reinado de **Josías** o **Ezequías** (c. 650-600 a.C., antes del exilio babilónico), estos amuletos constituyen **el texto bíblico físico más antiguo jamás hallado en el mundo**, antecediendo a los Rollos del Mar Muerto por más de 400 años y demostrando que los textos litúrgicos del Pentateuco ya circulaban por escrito en el reino de Judá antes de la destrucción de Jerusalén.
    `,
    biblicalReferences: [
      { reference: 'Números 6:24-26', context: 'La Bendición Sacerdotal Aarónica' },
      { reference: 'Deuteronomio 7:9', context: 'El Dios fiel que guarda el pacto y la misericordia' },
      { reference: 'Salmos 67:1', context: 'Dios tenga misericordia de nosotros y haga resplandecer su rostro' },
    ],
    epigraphy: {
      originalScript: 'יְבָרֶכְךָ יְהוָה וְיִשְׁמְרֶךָ יָאֵר יְהוָה פָּנָיו אֵלֶיךָ',
      language: 'Paleohebreo Arcaico',
      transliteration: 'Yevarejeja YHWH veyishmereja, yaer YHWH panav eleja',
      translation: 'Te bendiga YHWH y te guarde; haga brillar YHWH su rostro hacia ti',
      dateEstimate: 'c. 650 - 600 a.C. (Siglo VII a.C.)',
    },
    museumOrLocation: 'Museo de Israel (Jerusalén)',
    keyArtifact: 'Láminas micro-grabadas de plata pura Ketef Hinnom 1 y 2',
    tags: ['Ketef Hinnom', 'Números 6', 'YHWH', 'Paleohebreo', 'Primer Templo'],
  },

  // --- CATEGORÍA 3: APOLOGÉTICA Y CONFIABILIDAD TEXTUAL ---
  {
    id: 'acts-archaeological-accuracy',
    title: 'La Precisión Histórica del Libro de Hechos según la Epigrafía Imperial Romana',
    slug: 'precision-historica-libro-hechos-arqueologia-romana',
    category: 'apologetics_reliability',
    region: 'turkey_asia_minor',
    regionLabel: 'Grecia, Turquía e Italia',
    publishDate: '2025-01-18',
    institutionOrAuthor: 'Dr. Colin Hemer (Universidad de Cambridge) / Sir William Ramsay',
    readTimeMinutes: 7,
    summary:
      'El análisis de más de 80 títulos de magistrados cívicos, topónimos y puertos marítimos citados por Lucas en Hechos demuestra un conocimiento de primera mano imposible de falsificar en siglos posteriores.',
    contentMarkdown: `
### El Estatus Académico de Lucas como Historiador
El célebre arqueólogo Sir William Ramsay inició sus investigaciones en Asia Menor convencido de que el libro de Hechos era una obra pseudónima compuesta a mediados del siglo II d.C. Sin embargo, tras décadas de excavaciones epigráficas concluyó: *"Lucas es un historiador de primer orden; no solo sus declaraciones de hechos son confiables, sino que posee el verdadero sentido histórico"*.

### Títulos Administrativos Exactos Verificados por Inscripciones
El Imperio Romano utilizaba un mosaico complejo y cambiante de cargos locales según si una provincia era senatorial o imperial. Lucas utiliza con exactitud matemática el término técnico preciso en cada ciudad:

1. **Procónsul (*Anthypatos*) en Chipre y Acaya:** Hechos 13:7 menciona al procónsul Sergio Paulo en Pafos y Hechos 18:12 a Lucio Junio Galión en Corinto. La *Inscripción de Delfos* (fechada en 52 d.C.) confirmó que Galión fue efectivamente procónsul en ese año exacto.
2. **Politarcas (*Politarches*) en Tesalónica:** Hechos 17:6 llama a los gobernantes de Tesalónica "politarcas", un término ausente en la literatura clásica que la crítica tachó de invención. En el siglo XIX se descubrió en el Arco de Vardar de Tesalónica una inscripción de mármol que enumera explícitamente a los "Politarcas" de la ciudad.
3. **El Magistrado Principal (*Protos*) en Malta:** Hechos 28:7 otorga a Publio el título de *protos* ("el principal de la isla"), título exacto confirmado por dos inscripciones halladas en Malta en griego y latín (*Municipii Melitensium Primus*).
4. **Tesorero de Corinto (*Erastus*):** En 1929 se halló cerca del teatro de Corinto una losa con la inscripción: *"Erasto, edil por su propio gasto, puso este pavimento"*, coincidiendo con Romanos 16:23.
    `,
    biblicalReferences: [
      { reference: 'Hechos 18:12-17', context: 'Pablo comparece ante el procónsul Galión en Corinto' },
      { reference: 'Hechos 17:6-8', context: 'Los politarcas de Tesalónica son alborotados por los acusadores' },
      { reference: 'Romanos 16:23', context: 'Erasto, tesorero de la ciudad, y el hermano Cuarto os saludan' },
    ],
    museumOrLocation: 'Museos Arqueológicos de Tesalónica, Corinto y Museo Británico',
    keyArtifact: 'Inscripción de los Politarcas de Vardar e Inscripción de Erasto',
    tags: ['Hechos', 'Lucas', 'Apologética', 'Galión', 'Erasto', 'Imperio Romano'],
  },
  {
    id: 'hittites-biblical-vindication',
    title: 'La Vindicación del Imperio Hitita: De Mito Escéptico a Superpotencia Desenterrada',
    slug: 'vindicacion-imperio-hitita-arqueologia-hattusa',
    category: 'apologetics_reliability',
    region: 'turkey_asia_minor',
    regionLabel: 'Boğazköy (Hattusa, Turquía)',
    publishDate: '2024-11-02',
    institutionOrAuthor: 'Instituto Arqueológico Alemán / Hugo Winckler',
    readTimeMinutes: 6,
    summary:
      'Durante el siglo XIX, los críticos afirmaron que los "heteos" o hititas eran un pueblo mítico inventado por los autores bíblicos. El descubrimiento de Hattusa y miles de tablillas cuneiformes demostró que fue uno de los imperios más poderosos del mundo antiguo.',
    contentMarkdown: `
### La Acusación Crítica del Siglo XIX
En el Génesis y los libros históricos de la Biblia se menciona más de 40 veces a los hijos de Het o hititas (ej. Abraham comprando la cueva de Macpela a Efrón el heteo en Génesis 23, Urías el heteo en 2 Samuel 11).

Debido a que ninguna fuente griega ni romana clásica mencionaba a los hititas, los eruditos liberales de la escuela decimonónica catalogaron a este pueblo como un error anacrónico bíblico.

### El Hallazgo de la Capital Imperial en Boğazköy
En 1906, el arqueólogo Hugo Winckler inició excavaciones en Boğazköy (centro de Turquía), desenterrando las murallas monumentales de **Hattusa**, la capital del colosal Imperio Hitita.

Entre las ruinas se halló el archivo real de la corte con más de **10,000 tablillas de arcilla cuneiformes** en lengua hitita y acadia, incluyendo la copia oficial hitita del tratado de paz tras la famosa Batalla de Kadesh contra el faraón Ramsés II.

### Estructura de los Tratados de Vasallaje del Pentateuco
El estudio de los tratados hititas del segundo milenio a.C. reveló una estructura formal idéntica (Preámbulo, Prólogo histórico, Estipulaciones, Testigos y Bendiciones/Maldiciones) a la estructura literaria del libro de **Deuteronomio**, confirmando que el libro fue compuesto en la época mosaica (siglo XV-XIII a.C.) y no en el siglo VII a.C. como argumentaban las teorías documentarias tardías.
    `,
    biblicalReferences: [
      { reference: 'Génesis 23:1-20', context: 'Abraham compra el campo de Macpela a los hijos de Het' },
      { reference: '2 Samuel 11:3', context: 'Urías heteo, esposo de Betsabé y valiente de David' },
      { reference: '2 Reyes 7:6', context: 'El ejército sirio huye creyendo que Israel alquiló a los reyes de los heteos' },
    ],
    museumOrLocation: 'Museo de las Civilizaciones de Anatolia (Ankara, Turquía)',
    keyArtifact: 'Archivo Real de Tablillas Cuneiformes de Hattusa y Tratado de Kadesh',
    tags: ['Hititas', 'Hattusa', 'Deuteronomio', 'Apologética', 'Tratados de Alianza'],
  },
];
