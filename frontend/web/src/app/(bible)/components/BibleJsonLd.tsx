export default function BibleJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['SoftwareApplication', 'Dataset'],
        '@id': 'https://bible.jorgedoicela.com/#bible-platform',
        'url': 'https://bible.jorgedoicela.com',
        'name': 'Biblia Modular | Plataforma de Estudio Exegético',
        'applicationCategory': 'EducationalApplication, ReferenceApplication',
        'operatingSystem': 'Web, iOS, Android',
        'description': 'Plataforma de exégesis bíblica académica con herramientas de estudio modulares: Interlineal Inverso Masorético (BHS Hebreo / NA28 Griego), Léxicos Strong (BDB, Thayer, Gesenius), Atlas Bíblico WGS84, Cronología Sincrónica, Catálogo de Arqueología, Evangelización y App Móvil Expo.',
        'inLanguage': ['es', 'en', 'he', 'grc'],
        'author': {
          '@type': 'Person',
          '@id': 'https://jorgedoicela.com/#person',
          'name': 'Jorge Ismael Doicela Molina',
          'url': 'https://jorgedoicela.com'
        },
        'featureList': [
          'Lectura continua editorial',
          'Comparador paralelo multiversión y diff textual (LCS)',
          'Interlineal inverso morfológico BHS / NA28',
          'Léxicos Strong BDB, Thayer y Gesenius con ocurrencias canónicas',
          'Atlas bíblico georreferenciado WGS84 e itinerarios históricos',
          'Cronología sincrónica de reyes, profetas e imperios',
          'Evidencia material y catálogo arqueológico',
          'Evangelización bíblica, rutas soteriológicas y apologética práctica',
          'App móvil nativa React Native / Expo con soporte Offline-First'
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
