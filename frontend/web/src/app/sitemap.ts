import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    // ─────────────────────────────────────────────────────────────
    // 1. LANDING PAGE (jorgedoicela.com)
    // Al migrar a servidor independiente: copiar solo este bloque
    // en el sitemap.ts de la nueva app Next.js y borrar los demás.
    // ─────────────────────────────────────────────────────────────
    const landingRoutes: MetadataRoute.Sitemap = [
        {
            url: 'https://jorgedoicela.com',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: 'https://jorgedoicela.com/consulta',
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://jorgedoicela.com/links',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://jorgedoicela.com/llms.txt',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];

    // ─────────────────────────────────────────────────────────────
    // 2. PORTAFOLIO PROFESIONAL (portfolio.jorgedoicela.com)
    // Al migrar a servidor independiente: copiar solo este bloque
    // en el sitemap.ts de la nueva app Next.js y borrar los demás.
    // ─────────────────────────────────────────────────────────────
    const portfolioRoutes: MetadataRoute.Sitemap = [
        {
            url: 'https://portfolio.jorgedoicela.com',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.95,
        },
        {
            url: 'https://portfolio.jorgedoicela.com/llms.txt',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];

    // ─────────────────────────────────────────────────────────────
    // 3. SOFTWARE (software.jorgedoicela.com) — 8 Áreas
    // Al migrar a servidor independiente: copiar solo este bloque
    // en el sitemap.ts de la nueva app Next.js y borrar los demás.
    // ─────────────────────────────────────────────────────────────
    const softwareRoutes: MetadataRoute.Sitemap = [
        {
            url: 'https://software.jorgedoicela.com',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.95,
        },
        {
            url: 'https://software.jorgedoicela.com/llms.txt',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: 'https://software.jorgedoicela.com/news',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://software.jorgedoicela.com/blog',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://software.jorgedoicela.com/forum',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.85,
        },
        {
            url: 'https://software.jorgedoicela.com/ai',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://software.jorgedoicela.com/cybersecurity',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://software.jorgedoicela.com/tutorials',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://software.jorgedoicela.com/projects',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://software.jorgedoicela.com/infrastructure',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ];

    // ─────────────────────────────────────────────────────────────
    // 4. BIBLIA MODULAR (bible.jorgedoicela.com) — 6 Suites
    // Al migrar a servidor independiente: copiar solo este bloque
    // en el sitemap.ts de la nueva app Next.js y borrar los demás.
    // ─────────────────────────────────────────────────────────────
    const bibleRoutes: MetadataRoute.Sitemap = [
        {
            url: 'https://bible.jorgedoicela.com',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.95,
        },
        {
            url: 'https://bible.jorgedoicela.com/llms.txt',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: 'https://bible.jorgedoicela.com/study/standard',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://bible.jorgedoicela.com/study/parallel',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://bible.jorgedoicela.com/study/interlinear',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://bible.jorgedoicela.com/study/word-study',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://bible.jorgedoicela.com/study/literary',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://bible.jorgedoicela.com/study/historical-context',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://bible.jorgedoicela.com/study/evangelism',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
    ];

    // Servidor consolidado actual (1 GB RAM): todas las rutas juntas.
    // Al migrar, cada servidor retorna solo su bloque correspondiente.
    return [...landingRoutes, ...portfolioRoutes, ...softwareRoutes, ...bibleRoutes];
}
