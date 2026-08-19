export interface AncientManuscriptRecord {
  id: string;
  name: string;
  classification: 'Dead Sea Scroll' | 'Papyrus' | 'Uncial Codex' | 'Bulla / Seal' | 'Ostracon';
  approximateDate: string;
  discoveryLocation: string;
  currentLocation: string;
  language: string;
  contentsOverview: string;
  importance: string;
}

export const ANCIENT_MANUSCRIPTS: AncientManuscriptRecord[] = [
  {
    id: '1qisa-a',
    name: 'Gran Rollo de Isaías (1QIsa)',
    classification: 'Dead Sea Scroll',
    approximateDate: 'c. 125 a.C.',
    discoveryLocation: 'Cueva 1, Qumrán (Mar Muerto)',
    currentLocation: 'Santuario del Libro, Museo de Israel (Jerusalén)',
    language: 'Hebreo Bíblico (escritura cuadrada asiria/hebrea)',
    contentsOverview: 'Contiene los 66 capítulos completos del profeta Isaías en 54 columnas de pergamino de cuero.',
    importance: 'El manuscrito bíblico completo más antiguo del mundo; prueba la inmutabilidad del texto masorético durante más de mil años.',
  },
  {
    id: '4q521',
    name: 'Apocalipsis Mesiánico de Qumrán (4Q521)',
    classification: 'Dead Sea Scroll',
    approximateDate: 'c. 100 a.C.',
    discoveryLocation: 'Cueva 4, Qumrán',
    currentLocation: 'Museo de Israel (Jerusalén)',
    language: 'Hebreo',
    contentsOverview: 'Texto que describe las señales del Mesías: resucitar a los muertos, sanar a los heridos y anunciar buenas nuevas a los pobres.',
    importance: 'Paralelo asombroso con la respuesta de Jesús a Juan el Bautista en Mateo 11:4-5 y Lucas 7:22.',
  },
  {
    id: 'ketef-hinnom-1-2',
    name: 'Amuletos de Plata de Ketef Hinnom (KH1 y KH2)',
    classification: 'Bulla / Seal',
    approximateDate: 'c. 650 - 600 a.C. (Primer Templo)',
    discoveryLocation: 'Tumba 24, Ketef Hinnom (Jerusalén)',
    currentLocation: 'Museo de Israel (Jerusalén)',
    language: 'Paleohebreo arcaico',
    contentsOverview: 'Micro-grabado de la Bendición Sacerdotal de Números 6:24-26 con el Tetragrámaton YHWH.',
    importance: 'El texto bíblico físico más antiguo del planeta (anterior a los Rollos del Mar Muerto por 400 años).',
  },
  {
    id: 'hezekiah-bulla',
    name: 'Sello Real del Rey Ezequías',
    classification: 'Bulla / Seal',
    approximateDate: 'c. 700 a.C.',
    discoveryLocation: 'Excavaciones del Ophel, Jerusalén',
    currentLocation: 'Colección de la Autoridad de Antigüedades de Israel',
    language: 'Paleohebreo',
    contentsOverview: 'Impresión en arcilla con escarabajo alado y disco solar con la inscripción: "Perteneciente a Ezequías, hijo de Acaz, rey de Judá".',
    importance: 'Sello oficial del rey piadoso de Judá que resistió a Senaquerib (2 Reyes 18-20).',
  },
  {
    id: 'p52-rylands',
    name: 'Papiro Rylands P52 (Evangelio de Juan)',
    classification: 'Papyrus',
    approximateDate: 'c. 115 - 125 d.C.',
    discoveryLocation: 'Oxirrinco, Egipto',
    currentLocation: 'Biblioteca John Rylands (Manchester, Reino Unido)',
    language: 'Griego Koiné',
    contentsOverview: 'Fragmento del Evangelio de Juan (Juan 18:31-33 en el recto y 18:37-38 en el verso: "¿Qué es la verdad?").',
    importance: 'El fragmento físico del Nuevo Testamento más antiguo conocido; refuta que el cuarto evangelio fuera una invención tardía del siglo II.',
  },
  {
    id: 'codex-sinaiticus',
    name: 'Códice Sinaítico (Codex Sinaiticus)',
    classification: 'Uncial Codex',
    approximateDate: 'c. 330 - 360 d.C.',
    discoveryLocation: 'Monasterio de Santa Catalina, Monte Sinaí',
    currentLocation: 'Museo Británico (Londres) / Biblioteca Británica',
    language: 'Griego Koiné Uncial',
    contentsOverview: 'Manuscrito completo del Nuevo Testamento y gran parte de la Septuaginta (LXX).',
    importance: 'Uno de los cuatro grandes códices unciales que constituyen la base de la crítica textual académica moderna.',
  },
];
