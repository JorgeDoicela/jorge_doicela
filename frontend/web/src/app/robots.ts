import type { MetadataRoute } from 'next';

// User-Agents de bots de IA autorizados (GEO / AI SEO)
const aiBots = [
    'GPTBot',
    'ChatGPT-User',
    'PerplexityBot',
    'ClaudeBot',
    'anthropic-ai',
    'Google-Extended',
    'Applebot-Extended',
    'Bingbot',
];

export default function robots(): MetadataRoute.Robots {
    // ─────────────────────────────────────────────────────────────
    // REGLAS COMPARTIDAS (aplican a todos los subdominios)
    //
    // NOTA DE MIGRACIÓN: Al extraer un proyecto a servidor propio,
    // crea un robots.ts con las mismas reglas de aiBots y rutas
    // protegidas, ajustando solo el 'sitemap' a la URL correcta.
    //
    // Ejemplo para software.jorgedoicela.com independiente:
    //   sitemap: 'https://software.jorgedoicela.com/sitemap.xml'
    // ─────────────────────────────────────────────────────────────
    return {
        rules: [
            // Regla optimizada para rastreadores de Inteligencia Artificial (GEO / AI SEO)
            {
                userAgent: aiBots,
                allow: ['/', '/llms.txt'],
                disallow: ['/api/', '/_next/', '/socket.io/'],
            },
            // Regla general para navegadores y motores de búsqueda web estándar
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/', '/socket.io/'],
            },
        ],
        // Sitemap unificado del servidor consolidado actual (1 GB RAM).
        // Al migrar un proyecto a servidor propio, apuntar a su sitemap individual:
        //   'https://portfolio.jorgedoicela.com/sitemap.xml'
        //   'https://software.jorgedoicela.com/sitemap.xml'
        //   'https://bible.jorgedoicela.com/sitemap.xml'
        sitemap: 'https://jorgedoicela.com/sitemap.xml',
    };
}
