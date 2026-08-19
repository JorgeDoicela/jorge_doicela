import { WorldEmpireData } from '../types';

export const WORLD_EMPIRES: WorldEmpireData[] = [
  // --- EGIPTO ---
  {
    id: 'shishak',
    name: 'Imperio Egipcio (Dinastía XXII)',
    rulerName: 'Faraón Sisac (Sheshonq I)',
    empire: 'egypt',
    startYearBC: 943,
    endYearBC: 922,
    interactionWithBiblicalHistory:
      'Brindó asilo a Jeroboam cuando huía de Salomón. En el quinto año de Roboam (925 a.C.) invadió Judá y saqueó los tesoros de oro del Templo de Salomón.',
    biblicalReferences: ['1 Reyes 11:40', '1 Reyes 14:25-26', '2 Crónicas 12:2-9'],
    archaeologicalArtifacts: ['Relieve del Portal Bubastita en el Templo de Karnak (enumera más de 150 ciudades conquistadas en Judá e Israel)'],
  },
  {
    id: 'necho_2',
    name: 'Imperio Egipcio (Dinastía XXVI Saíta)',
    rulerName: 'Faraón Necao II',
    empire: 'egypt',
    startYearBC: 610,
    endYearBC: 595,
    interactionWithBiblicalHistory:
      'Mató al piadoso rey Josías en la Batalla de Meguido (609 a.C.) cuando este intentó cerrarle el paso rumbo al río Éufrates en apoyo de Asiria contra Babilonia.',
    biblicalReferences: ['2 Reyes 23:29-35', '2 Crónicas 35:20-24', 'Jeremías 46:2'],
    archaeologicalArtifacts: ['Estela de Sidón y fuentes griegas de Heródoto'],
  },

  // --- IMPERIO NEOASIRIO ---
  {
    id: 'tiglath_pileser_3',
    name: 'Imperio Neoasirio',
    rulerName: 'Tiglat-pileser III (Pul)',
    empire: 'assyria',
    startYearBC: 745,
    endYearBC: 727,
    interactionWithBiblicalHistory:
      'Recibió tributo masivo de Manahem de Israel. Acaz de Judá le pagó con plata y oro del Templo para que atacara la confederación sirio-efraimita, iniciando la primera deportación de Galilea y Neftalí.',
    biblicalReferences: ['2 Reyes 15:19-20', '2 Reyes 16:7-10', '1 Crónicas 5:26', 'Isaías 7:1-9'],
    archaeologicalArtifacts: ['Relieves de Calaj (Nimrud) conservados en el Museo Británico'],
  },
  {
    id: 'sennacherib',
    name: 'Imperio Neoasirio',
    rulerName: 'Senaquerib',
    empire: 'assyria',
    startYearBC: 705,
    endYearBC: 681,
    interactionWithBiblicalHistory:
      'Invadió Judá en 701 a.C., destruyó Laquis y sitió a Ezequías en Jerusalén. Su ejército fue exterminado por el ángel del Señor y regresó a Nínive donde fue asesinado por sus hijos.',
    biblicalReferences: ['2 Reyes 18:13 - 19:37', '2 Crónicas 32', 'Isaías 36 - 37'],
    archaeologicalArtifacts: ['Prisma de Taylor / Anales de Senaquerib ("A Ezequías el judío lo encerré en su ciudad real como un pájaro en una jaula")', 'Relieves del asedio de Laquis en Nínive'],
  },

  // --- IMPERIO NEOBABILÓNICO ---
  {
    id: 'nebuchadnezzar_2',
    name: 'Imperio Neobabilónico',
    rulerName: 'Nabucodonosor II',
    empire: 'babylon',
    startYearBC: 605,
    endYearBC: 562,
    interactionWithBiblicalHistory:
      'Venció a Egipto en Carquemis (605 a.C.), realizó 3 deportaciones de judíos (incluyendo a Daniel en 605 a.C. y Ezequiel en 597 a.C.), destruyó Jerusalén y quemó el Templo en 586 a.C.',
    biblicalReferences: ['2 Reyes 24 - 25', '2 Crónicas 36', 'Jeremías 39; 52', 'Daniel 1 - 4'],
    archaeologicalArtifacts: ['Crónica Babilónica (Tablilla BM 21946 que data la captura de Jerusalén en 597 a.C.)', 'Ladrillos con inscripción cuneiforme y Puerta de Ishtar'],
  },

  // --- IMPERIO MEDO-PERSA ---
  {
    id: 'cyrus_the_great',
    name: 'Imperio Medo-Persa (Aqueménida)',
    rulerName: 'Ciro II el Grande',
    empire: 'persia',
    startYearBC: 559,
    endYearBC: 530,
    interactionWithBiblicalHistory:
      'Conquistó Babilonia en 539 a.C. y emitió en 538 a.C. el histórico decreto que autorizó a los judíos exiliados regresar a Judá y reconstruir el Templo de Jerusalén bajo Zorobabel, cumpliendo Isaías 44:28 y Jeremías 29:10.',
    biblicalReferences: ['2 Crónicas 36:22-23', 'Esdras 1:1-4', 'Isaías 44:28; 45:1', 'Daniel 6:28'],
    archaeologicalArtifacts: ['Cilindro de Ciro (declaración cuneiforme de repatriación de pueblos desterrados y restauración de templos - Museo Británico)'],
  },
  {
    id: 'darius_1',
    name: 'Imperio Medo-Persa',
    rulerName: 'Darío I el Grande',
    empire: 'persia',
    startYearBC: 522,
    endYearBC: 486,
    interactionWithBiblicalHistory:
      'Confirmó el decreto de Ciro tras hallar el rollo en Ecbatana, financió la reconstrucción con el tesoro real y garantizó la dedicación del Segundo Templo en 516 a.C.',
    biblicalReferences: ['Esdras 5 - 6', 'Hageo 1:1', 'Zacarías 1:1'],
    archaeologicalArtifacts: ['Inscripción trilingüe de Behistún', 'Palacio monumental de Persépolis'],
  },
  {
    id: 'artaxerxes_1',
    name: 'Imperio Medo-Persa',
    rulerName: 'Artajerjes I Longímano',
    empire: 'persia',
    startYearBC: 465,
    endYearBC: 424,
    interactionWithBiblicalHistory:
      'Envió a Esdras con facultades legales para enseñar la Ley en 458 a.C. y nombró a su copero Nehemías gobernador de Judá en 445 a.C. con cartas oficiales para reconstruir las murallas de Jerusalén.',
    biblicalReferences: ['Esdras 7 - 8', 'Nehemías 1 - 2'],
    archaeologicalArtifacts: ['Papiros arameos de Elefantina'],
  },

  // --- GRECIA Y ÉPOCA HELENÍSTICA ---
  {
    id: 'antiochus_4',
    name: 'Imperio Seléucida (Grecia Helenística)',
    rulerName: 'Antíoco IV Epífanes',
    empire: 'greece',
    startYearBC: 175,
    endYearBC: 164,
    interactionWithBiblicalHistory:
      'Prohibió la circuncisión, el Shabat y la posesión de rollos de la Torá. En 167 a.C. profanó el Segundo Templo ofreciendo cerdos sobre el altar y erigiendo una estatua de Zeus Olímpico (la abominación desoladora), desatando la revuelta de los Macabeos.',
    biblicalReferences: ['Daniel 8:9-14; 11:21-35', '1 y 2 Macabeos'],
    archaeologicalArtifacts: ['Monedas seléucidas con el título "Theos Epiphanes" (Dios manifestado)'],
  },

  // --- IMPERIO ROMANO ---
  {
    id: 'caesar_augustus',
    name: 'Imperio Romano',
    rulerName: 'César Augusto (Octavio)',
    empire: 'rome',
    startYearBC: 27,
    endYearBC: 14, // 14 d.C.
    interactionWithBiblicalHistory:
      'Primer emperador de Roma. Decretó el censo de todo el mundo habitado que obligó a José y María a viajar desde Nazaret a Belén, propiciando el nacimiento profetizado del Mesías.',
    biblicalReferences: ['Lucas 2:1-7'],
    archaeologicalArtifacts: ['Res Gestae Divi Augusti (Inscripción de Ankara)', 'Ara Pacis Augustae'],
  },
  {
    id: 'tiberius_caesar',
    name: 'Imperio Romano',
    rulerName: 'Tiberio César',
    empire: 'rome',
    startYearBC: 14, // 14 d.C.
    endYearBC: 37, // 37 d.C.
    interactionWithBiblicalHistory:
      'Emperador reinante durante todo el ministerio público, crucifixión y resurrección de Jesucristo bajo el procurador Poncio Pilato en Judea (Lucas 3:1: "En el año decimoquinto del imperio de Tiberio César...").',
    biblicalReferences: ['Lucas 3:1', 'Mateo 22:17-21 ("Dad al César lo que es del César")', 'Juan 19:12-15'],
    archaeologicalArtifacts: ['Inscripción de Poncio Pilato en Cesarea Marítima', 'Denario de plata con el rostro de Tiberio'],
  },
];
