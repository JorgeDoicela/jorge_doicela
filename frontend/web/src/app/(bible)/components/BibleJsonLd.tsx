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
        'description': 'Plataforma de exégesis bíblica académica con 9 motores de estudio: Interlineal Inverso Masorético (BHS Hebreo / NA28 Griego), Léxicos Strong (BDB, Thayer, Gesenius), Búsqueda Gramatical sintáctica, Atlas Bíblico WGS84, Cronología Sincrónica, Catálogo de Arqueología y App Móvil Expo.',
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
          'Léxicos Strong BDB, Thayer y Gesenius',
          'Búsqueda sintáctica y gramatical avanzada',
          'Estructuras literarias y detección de quiasmos',
          'Atlas bíblico georreferenciado WGS84',
          'Cronología sincrónica de reyes, profetas e imperios',
          'Evidencia material y artículos arqueológicos',
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
