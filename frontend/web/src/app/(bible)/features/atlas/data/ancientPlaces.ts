import { AncientPlace } from '../types';

export const ANCIENT_PLACES: AncientPlace[] = [
  {
    id: 'jerusalem',
    name: 'Jerusalén',
    originalName: {
      hebrew: 'יְרוּשָׁלַיִם',
      greek: 'Ἱεροσόλυμα',
      transliteration: 'Yerushalayim',
      meaning: 'Fundación o morada de paz / Posesión de paz',
    },
    coordinates: { lat: 31.7767, lng: 35.2345 },
    category: 'city',
    era: ['patriarchs', 'monarchy', 'exile_restoration', 'second_temple', 'apostolic'],
    modernName: 'Al-Quds / Yerushalayim',
    country: 'Israel / Palestina',
    elevationMeters: 754,
    description:
      'Centro espiritual, político y profético del pueblo de Dios. Antigua fortaleza jebusea conquistada por David, sede de los Templos de Salomón y Herodes, escenario de la pasión, resurrección y origen de la Iglesia apostólica.',
    biblicalReferences: [
      { reference: 'Génesis 14:18', context: 'Melquisedec, rey de Salem y sacerdote del Dios Altísimo' },
      { reference: '2 Samuel 5:6-9', context: 'David conquista la fortaleza de Sion' },
      { reference: '1 Reyes 8:1', context: 'Dedicación del Templo de Salomón' },
      { reference: 'Lucas 24:46-49', context: 'Proclamación del evangelio comenzando desde Jerusalén' },
      { reference: 'Hechos 2:1-4', context: 'Derramamiento del Espíritu Santo en Pentecostés' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Túnel de Ezequías y la inscripción de Siloé (s. VIII a.C.)',
        'Sello de arcilla (bulla) del rey Ezequías y del profeta Isaías',
        'Pared occidental del Monte del Templo (Muro de las Lamentaciones)',
        'Escaleras monumentales del Templo y Calle Herodiana',
      ],
      excavationStatus: 'Excavación continua (Ciudad de David, Monte de Sion)',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'bethlehem',
    name: 'Belén de Judá',
    originalName: {
      hebrew: 'בֵּית לֶחֶם',
      greek: 'Βηθλεέμ',
      transliteration: 'Beit Lejem',
      meaning: 'Casa del Pan',
    },
    coordinates: { lat: 31.7054, lng: 35.2024 },
    category: 'city',
    era: ['patriarchs', 'monarchy', 'second_temple'],
    modernName: 'Beit Lahm',
    country: 'Cisjordania (Palestina)',
    elevationMeters: 775,
    description:
      'Ciudad natal del rey David y lugar profetizado para el nacimiento del Mesías de Israel (Miqueas 5:2). Escenario de la historia de Rut y Booz.',
    biblicalReferences: [
      { reference: 'Rut 1:19', context: 'Llegada de Noemí y Rut a Belén' },
      { reference: '1 Samuel 16:1', context: 'Unción de David por Samuel en Belén' },
      { reference: 'Miqueas 5:2', context: 'Profecía del nacimiento del Gobernante eterno en Belén Efrata' },
      { reference: 'Mateo 2:1', context: 'Nacimiento de Jesús en días del rey Herodes' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Bulla fiscal en la Ciudad de David mencionando envíos desde Belén (s. VII a.C.)',
        'Complejo de cuevas de la Basílica de la Natividad',
      ],
      excavationStatus: 'Yacimiento histórico protegido',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'nazareth',
    name: 'Nazaret',
    originalName: {
      hebrew: 'נָצְרַת',
      greek: 'Ναζαρέτ',
      transliteration: 'Natzeret',
      meaning: 'Retoño / Vástago (derivado de Netzer)',
    },
    coordinates: { lat: 32.7019, lng: 35.2979 },
    category: 'city',
    era: ['second_temple', 'apostolic'],
    modernName: 'En-Nasira / Nazaret',
    country: 'Israel',
    elevationMeters: 350,
    description:
      'Aldea agrícola de la Baja Galilea donde Jesús creció, vivió hasta los 30 años y proclamó el cumplimiento mesiánico en su sinagoga local.',
    biblicalReferences: [
      { reference: 'Lucas 1:26-38', context: 'La Anunciación a María' },
      { reference: 'Lucas 4:16-30', context: 'Jesús lee Isaías 61 en la sinagoga de Nazaret' },
      { reference: 'Juan 1:46', context: '¿De Nazaret puede salir algo de bueno?' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Vivienda del siglo I con cisternas y bodegas excavadas en roca',
        'Inscripción de Cesarea de las órdenes sacerdotales (menciona la orden de Hapizes en Nazaret)',
      ],
      excavationStatus: 'Preservado bajo la Basílica de la Anunciación',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'capernaum',
    name: 'Capernaúm',
    originalName: {
      hebrew: 'כְּפַר נַחוּם',
      greek: 'Καπερναούμ',
      transliteration: 'Kfar Najum',
      meaning: 'Aldea de Nahúm / Aldea del Consuelo',
    },
    coordinates: { lat: 32.8809, lng: 35.5752 },
    category: 'city',
    era: ['second_temple', 'apostolic'],
    modernName: 'Kfar Nahum',
    country: 'Israel',
    elevationMeters: -209,
    description:
      'Ciudad portuaria en la ribera noroeste del Mar de Galilea, sede principal del ministerio público de Jesús ("su propia ciudad") y hogar de Pedro, Andrés, Santiago, Juan y Mateo.',
    biblicalReferences: [
      { reference: 'Mateo 4:13', context: 'Jesús deja Nazaret y establece su morada en Capernaúm' },
      { reference: 'Marcos 1:21-28', context: 'Sanidad en la sinagoga de Capernaúm' },
      { reference: 'Marcos 2:1-12', context: 'Sanidad del paralítico descolgado por el techo' },
      { reference: 'Juan 6:59', context: 'Discurso del Pan de Vida en la sinagoga' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Cimientos de basalto negro de la sinagoga del siglo I',
        'Casa octogonal bizantina construida sobre la "Casa de Pedro"',
        'Anzuelos, pesos de red y monedas del siglo I',
      ],
      excavationStatus: 'Excavado por los franciscanos (Custodia de Tierra Santa)',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'jericho',
    name: 'Jericó',
    originalName: {
      hebrew: 'יְרִיחוֹ',
      greek: 'Ἰεριχώ',
      transliteration: 'Yerijo',
      meaning: 'Ciudad de las palmeras / Lugar fragante',
    },
    coordinates: { lat: 31.8569, lng: 35.4631 },
    category: 'city',
    era: ['patriarchs', 'exodus_conquest', 'monarchy', 'second_temple'],
    modernName: 'Ariha',
    country: 'Cisjordania (Palestina)',
    elevationMeters: -258,
    description:
      'Considerada una de las ciudades habitadas más antiguas y de menor altitud de la Tierra. Primera ciudad fortificada conquistada por los israelitas bajo Josué; lugar de sanidad del ciego Bartimeo y encuentro con Zaqueo.',
    biblicalReferences: [
      { reference: 'Josué 6:1-27', context: 'Caída milagrosa de las murallas de Jericó' },
      { reference: '2 Reyes 2:19-22', context: 'Eliseo purifica las aguas del manantial con sal' },
      { reference: 'Lucas 19:1-10', context: 'Jesús y el publicano Zaqueo' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Tell es-Sultan: Murallas de adobe colapsadas hacia afuera formando rampas',
        'Vasijas llenas de grano carbonizado intacto (evidencia de asedio corto y sin saqueo)',
      ],
      excavationStatus: 'Tell es-Sultan (Patrimonio Mundial UNESCO)',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'mount_sinai',
    name: 'Monte Sinaí / Horeb',
    originalName: {
      hebrew: 'הַר סִינַי / חֹרֵב',
      greek: 'Σινᾶ',
      transliteration: 'Har Sinai / Jorev',
      meaning: 'Monte de la zarza / Desolación',
    },
    coordinates: { lat: 28.5394, lng: 33.9753 },
    category: 'mountain',
    era: ['exodus_conquest', 'monarchy'],
    modernName: 'Jabal Musa',
    country: 'Egipto (Península del Sinaí)',
    elevationMeters: 2285,
    description:
      'Montaña sagrada donde Yahvé entregó el Decálogo y la Ley a Moisés, selló el Pacto con Israel y donde se refugió el profeta Elías huyendo de Jezabel.',
    biblicalReferences: [
      { reference: 'Éxodo 19:16-25', context: 'Manifestación de la gloria divina con truenos y fuego' },
      { reference: 'Éxodo 20:1-17', context: 'Entrega de los Diez Mandamientos' },
      { reference: '1 Reyes 19:8-18', context: 'El silbo apacible y delicado ante Elías en la cueva' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Monasterio de Santa Catalina en la base (funda siglo VI)',
        'Códice Sinaítico (Codex Sinaiticus NA28)',
      ],
      excavationStatus: 'Sitio de peregrinación histórica',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'mount_carmel',
    name: 'Monte Carmelo',
    originalName: {
      hebrew: 'הַר הַכַּרְמֶל',
      greek: 'Κάρμηλος',
      transliteration: 'Har HaKarmel',
      meaning: 'Jardín de Dios / Huerto frondoso',
    },
    coordinates: { lat: 32.735, lng: 35.045 },
    category: 'mountain',
    era: ['monarchy'],
    modernName: 'Har HaKarmel',
    country: 'Israel',
    elevationMeters: 546,
    description:
      'Cordillera costera con abundante vegetación donde el profeta Elías desafió y derrotó a los 450 profetas de Baal demostrando con fuego que Yahvé es el único Dios.',
    biblicalReferences: [
      { reference: '1 Reyes 18:19-40', context: 'El duelo teológico del fuego del cielo en El-Muhraqa' },
      { reference: '2 Reyes 4:25', context: 'La mujer sunamita acude a Eliseo en el Carmelo' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Altar de sacrificios tradicional en El-Muhraqa',
        'Cuevas habitadas por profetas del período del Hierro',
      ],
      excavationStatus: 'Parque Nacional Carmel',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'sea_of_galilee',
    name: 'Mar de Galilea / Lago de Genesaret / Tiberias',
    originalName: {
      hebrew: 'יָם כִּנֶּרֶת',
      greek: 'Θάλασσα τῆς Γαλιλαίας',
      transliteration: 'Yam Kinneret',
      meaning: 'Mar del Arpa (por su forma de Kinar)',
    },
    coordinates: { lat: 32.825, lng: 35.585 },
    category: 'water',
    era: ['monarchy', 'second_temple', 'apostolic'],
    modernName: 'Lago Kinneret',
    country: 'Israel',
    elevationMeters: -212,
    description:
      'Lago de agua dulce alimentado por el río Jordán. Escenario central de la mayoría de los milagros de Jesús: calma de la tempestad, caminata sobre las aguas, pesca milagrosa y llamado de los discípulos.',
    biblicalReferences: [
      { reference: 'Mateo 8:23-27', context: 'Jesús calma la tormenta en la barca' },
      { reference: 'Mateo 14:22-33', context: 'Jesús y Pedro caminan sobre el mar' },
      { reference: 'Juan 21:1-14', context: 'Aparición del Resucitado y desayuno en la playa con 153 peces' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'La "Barca de Jesús" de Ginosar (embarcación de pesca del siglo I recuperada en 1986)',
        'Puerto antiguo de Magdala con sinagoga del Segundo Templo',
      ],
      excavationStatus: 'Monitoreado hidrológica y arqueológicamente',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'dead_sea',
    name: 'Mar Muerto / Mar Salado / Mar de Aravá',
    originalName: {
      hebrew: 'יָם הַמֶּלַח',
      greek: 'Νεκρὰ Θάλασσα',
      transliteration: 'Yam HaMelaj',
      meaning: 'Mar de la Sal',
    },
    coordinates: { lat: 31.55, lng: 35.47 },
    category: 'water',
    era: ['patriarchs', 'monarchy', 'second_temple'],
    modernName: 'Al-Bahr al-Mayyit',
    country: 'Israel / Jordania / Cisjordania',
    elevationMeters: -430,
    description:
      'El punto más bajo en tierra emergida del planeta con salinidad extrema (34%). Cercano a las cuevas de Qumrán donde se hallaron los Rollos del Mar Muerto, Masada y los valles de En-gadi.',
    biblicalReferences: [
      { reference: 'Génesis 14:3', context: 'Valle de Sidim, que es el Mar Salado' },
      { reference: 'Ezequiel 47:8-10', context: 'Profecía de las aguas sanadas que darán vida abundante' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Cuevas de Qumrán (11 cuevas con más de 900 manuscritos hebreos y arameos de 250 a.C. a 68 d.C.)',
        'Fortaleza herodiana de Masada en el acantilado occidental',
      ],
      excavationStatus: 'Sitio arqueológico mundial clave',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'jordan_river',
    name: 'Río Jordán',
    originalName: {
      hebrew: 'נְהַר הַיַּרְדֵּן',
      greek: 'Ἰορδάνης',
      transliteration: 'Nehar HaYarden',
      meaning: 'El que desciende / El que fluye hacia abajo',
    },
    coordinates: { lat: 31.98, lng: 35.54 },
    category: 'water',
    era: ['patriarchs', 'exodus_conquest', 'monarchy', 'second_temple'],
    modernName: 'Nahr al-Urdun',
    country: 'Israel / Jordania / Cisjordania',
    elevationMeters: -350,
    description:
      'Río vital que atraviesa el valle de la falla del rift desde el Monte Hermón hasta el Mar Muerto. Lugar donde las aguas se detuvieron ante el Arca del Pacto, bautismo de Naamán el sirio y bautismo de Jesús por Juan el Bautista en Betania más allá del Jordán.',
    biblicalReferences: [
      { reference: 'Josué 3:14-17', context: 'El paso milagroso del río Jordán en tiempo de crecida' },
      { reference: '2 Reyes 5:10-14', context: 'Naamán se sumerge 7 veces y es sanado de la lepra' },
      { reference: 'Mateo 3:13-17', context: 'Bautismo de Jesús y descenso del Espíritu Santo' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Al-Maghtas (Betania más allá del Jordán en la orilla oriental - UNESCO)',
        'Restos de iglesias bizantinas con piscinas bautismales de inmersión',
      ],
      excavationStatus: 'Sitio de Patrimonio Mundial',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'mount_nebo',
    name: 'Monte Nebo / Cumbre de Pisga',
    originalName: {
      hebrew: 'הַר נְבוֹ',
      greek: 'Ναβαῦ',
      transliteration: 'Har Nevo',
      meaning: 'Monte de la elevación o profecía',
    },
    coordinates: { lat: 31.7683, lng: 35.7253 },
    category: 'mountain',
    era: ['exodus_conquest'],
    modernName: 'Jabal Nibu',
    country: 'Jordania',
    elevationMeters: 817,
    description:
      'Cumbre en la cordillera de Abarim desde donde Yahvé mostró a Moisés toda la Tierra Prometida antes de su muerte y sepultura por mano divina.',
    biblicalReferences: [
      { reference: 'Deuteronomio 32:49', context: 'Sube a este monte de Abarim, al monte Nebo' },
      { reference: 'Deuteronomio 34:1-6', context: 'Visión panorámica de Galaad hasta Dan y muerte de Moisés' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Basílica bizantina con mosaicos del siglo VI',
        'Mirador con vista a Jericó, Jerusalén y el Mar Muerto',
      ],
      excavationStatus: 'Monumento histórico protegido por el Franciscan Archaeological Institute',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'antioch_syria',
    name: 'Antioquía de Siria',
    originalName: {
      greek: 'Ἀντιόχεια ἡ ἐπὶ Δάφνῃ',
      transliteration: 'Antiocheia',
      meaning: 'Ciudad de Antíoco',
    },
    coordinates: { lat: 36.2021, lng: 36.1606 },
    category: 'city',
    era: ['apostolic'],
    modernName: 'Antakya',
    country: 'Turquía',
    elevationMeters: 80,
    description:
      'Tercera ciudad más importante del Imperio Romano, cuna de las misiones mundiales a los gentiles y primer lugar donde a los discípulos se les llamó "cristianos" (Hechos 11:26).',
    biblicalReferences: [
      { reference: 'Hechos 11:19-26', context: 'Bernabé y Saulo enseñan durante un año en Antioquía' },
      { reference: 'Hechos 13:1-3', context: 'El Espíritu Santo comisiona el primer viaje misionero' },
      { reference: 'Gálatas 2:11-14', context: 'Pablo confronta a Pedro en Antioquía' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Cueva de San Pedro (iglesia rupestre primitiva en la ladera del Monte Staurin)',
        'Mosaicos romanos conservados en el Museo Arqueológico de Hatay',
      ],
      excavationStatus: 'Zonas arqueológicas en recuperación tras sismos',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'ephesus',
    name: 'Éfeso',
    originalName: {
      greek: 'Ἔφεσος',
      transliteration: 'Ephesos',
      meaning: 'Deseable / Prometedora',
    },
    coordinates: { lat: 37.9497, lng: 27.3639 },
    category: 'city',
    era: ['apostolic'],
    modernName: 'Selçuk',
    country: 'Turquía',
    elevationMeters: 15,
    description:
      'Metrópolis comercial de Asia Menor, sede del templo de Artemisa (una de las 7 Maravillas del Mundo Antiguo). Centro del ministerio paulino durante 3 años, destinataria de la Epístola a los Efesios y primera de las siete iglesias del Apocalipsis.',
    biblicalReferences: [
      { reference: 'Hechos 19:1-41', context: 'Ministerio de Pablo, milagros y el motín de los plateros en el gran teatro' },
      { reference: 'Efesios 1:1', context: 'Carta de Pablo a los santos en Éfeso' },
      { reference: 'Apocalipsis 2:1-7', context: 'Mensaje del Señor resucitado a la iglesia de Éfeso' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Gran Teatro de Éfeso con capacidad para 25,000 espectadores (escenario de Hechos 19:29)',
        'Biblioteca de Celso y Calle de los Curetes',
        'Templo de Artemisa (Artemision)',
      ],
      excavationStatus: 'Excavado por el Instituto Arqueológico Austriaco (UNESCO)',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'athens',
    name: 'Atenas',
    originalName: {
      greek: 'Ἀθῆναι',
      transliteration: 'Athēnai',
      meaning: 'Ciudad de Atenea',
    },
    coordinates: { lat: 37.9715, lng: 23.7267 },
    category: 'city',
    era: ['apostolic'],
    modernName: 'Athinai / Atenas',
    country: 'Grecia',
    elevationMeters: 70,
    description:
      'Capital intelectual y filosófica de la Grecia clásica. Escenario del célebre discurso de Pablo ante filósofos epicúreos y estoicos en la colina del Areópago anunciando al "Dios no conocido".',
    biblicalReferences: [
      { reference: 'Hechos 17:16-34', context: 'Discurso de Pablo en el Areópago y conversión de Dionisio y Dámaris' },
      { reference: '1 Tesalonicenses 3:1', context: 'Pablo decide quedarse solo en Atenas' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Colina de Marte (Areópago) junto a la Acrópolis',
        'Ágora de Atenas y Stoa de Atalo donde Pablo dialogaba a diario',
        'Inscripciones que confirman la existencia de altares a "dioses anónimos"',
      ],
      excavationStatus: 'Monumento Mundial de la Humanidad',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'corinth',
    name: 'Corinto',
    originalName: {
      greek: 'Κόρινθος',
      transliteration: 'Korinthos',
      meaning: 'Adorno / Altura que domina',
    },
    coordinates: { lat: 37.9056, lng: 22.8797 },
    category: 'city',
    era: ['apostolic'],
    modernName: 'Archaia Korinthos',
    country: 'Grecia',
    elevationMeters: 65,
    description:
      'Próspero centro comercial en el istmo que conectaba el Peloponeso con la Grecia continental. Pablo residió 18 meses trabajando con Aquila y Priscila; destinataria de dos de las epístolas más influyentes del Nuevo Testamento.',
    biblicalReferences: [
      { reference: 'Hechos 18:1-18', context: 'Pablo comparece ante el procónsul Galión en el tribunal (Bema)' },
      { reference: '1 Corintios 13:1-13', context: 'Himno del amor ágape' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'El Bema o tribunal judicial donde compareció Pablo ante Lucio Junio Galión',
        'Inscripción de Erasto (tesorero de la ciudad mencionado en Romanos 16:23)',
        'Inscripción de la Sinagoga de los Hebreos',
      ],
      excavationStatus: 'Excavaciones de la American School of Classical Studies',
      verifiedByBiblicalArchaeology: true,
    },
  },
  {
    id: 'rome',
    name: 'Roma',
    originalName: {
      greek: 'Ῥώμη',
      transliteration: 'Rhōmē',
      meaning: 'Fuerza / Poder',
    },
    coordinates: { lat: 41.9028, lng: 12.4964 },
    category: 'city',
    era: ['second_temple', 'apostolic'],
    modernName: 'Roma',
    country: 'Italia',
    elevationMeters: 21,
    description:
      'Capital del Imperio Romano. Destino final del cuarto viaje de Pablo como prisionero, donde predicó bajo custodia militar durante dos años antes de su martirio.',
    biblicalReferences: [
      { reference: 'Romanos 1:7', context: 'A todos los que estáis en Roma, amados de Dios' },
      { reference: 'Hechos 28:16-31', context: 'Llegada de Pablo a Roma y ministerio sin impedimento' },
      { reference: '2 Timoteo 4:6-8', context: 'He peleado la buena batalla, he acabado la carrera' },
    ],
    archaeologicalNotes: {
      discoveries: [
        'Prisión Mamertina (Cárcel Tullianum)',
        'Vía Apia por donde ingresó el apóstol escoltado',
        'Catacumbas cristianas con iconografía de los siglos I al IV',
      ],
      excavationStatus: 'Patrimonio de la Humanidad',
      verifiedByBiblicalArchaeology: true,
    },
  },
];
