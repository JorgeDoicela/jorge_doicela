export function KartexJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['SoftwareApplication', 'Dataset'],
        '@id': 'https://kartex.jorgedoicela.com/#kartex-platform',
        'url': 'https://kartex.jorgedoicela.com',
        'name': 'KARTEX · Plataforma de Investigación y Estudio Bíblico | Jorge Doicela',
        'applicationCategory': 'EducationalApplication, ReferenceApplication',
        'operatingSystem': 'Web, iOS, Android',
        'description': 'KARTEX: Plataforma de investigación y estudio bíblico exegético con 9 motores de estudio modulares: Interlineal, Lexicón Strong, Atlas WGS84, Cronología, Arqueología, Evangelismo, Paralelo y App Móvil Expo.',
        'inLanguage': ['es', 'en', 'he', 'grc'],
        'author': {
          '@type': 'Person',
          '@id': 'https://jorgedoicela.com/#person',
          'name': 'Jorge Ismael Doicela Molina',
          'url': 'https://jorgedoicela.com'
        },
        'featureList': [
          'Lector: Lectura continua editorial',
          'Paralelo: Comparador paralelo multiversión y diff textual (LCS)',
          'Interlineal: Interlineal inverso morfológico BHS / NA28',
          'Lexicón: Léxicos Strong BDB, Thayer y Gesenius con ocurrencias canónicas',
          'Atlas: Atlas bíblico georreferenciado WGS84 e itinerarios históricos',
          'Cronología: Cronología sincrónica de reyes, profetas e imperios',
          'Arqueología: Evidencia material y catálogo arqueológico',
          'Evangelismo: Rutas soteriológicas y apologética práctica',
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

