export default function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://jorgedoicela.com/#person',
        'name': 'Jorge Doicela',
        'alternateName': 'Jorge Doicela M.',
        'url': 'https://jorgedoicela.com',
        'image': 'https://jorgedoicela.com/landing/logo/logo_color.png',
        'jobTitle': 'Software Developer & AI Engineering Student',
        'description': 'Desarrollador de software y estudiante de Ingeniería en Inteligencia Artificial y Ciberseguridad en Quito, Ecuador.',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Quito',
          'addressRegion': 'Pichincha',
          'addressCountry': 'EC'
        },
        'sameAs': [
          'https://www.linkedin.com/in/jorgedoicela',
          'https://github.com/JorgeDoicela',
          'https://www.tiktok.com/@jorge.doicela',
          'https://portfolio.jorgedoicela.com',
          'https://software.jorgedoicela.com',
          'https://bible.jorgedoicela.com'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://jorgedoicela.com/#website',
        'url': 'https://jorgedoicela.com',
        'name': 'Jorge Doicela',
        'publisher': {
          '@id': 'https://jorgedoicela.com/#person'
        },
        'inLanguage': ['es', 'en']
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
