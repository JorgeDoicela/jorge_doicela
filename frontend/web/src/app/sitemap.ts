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
            url: 'https://portfolio.jorgedoicela.com/portfolio',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ];

    // ─────────────────────────────────────────────────────────────
    // 3. SOFTWARE (software.jorgedoicela.com) — 7 Áreas
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
            url: 'https://software.jorgedoicela.com/software/news',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://software.jorgedoicela.com/software/blog',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://software.jorgedoicela.com/software/forum',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.85,
        },
        {
            url: 'https://software.jorgedoicela.com/software/ai',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://software.jorgedoicela.com/software/cybersecurity',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://software.jorgedoicela.com/software/tutorials',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://software.jorgedoicela.com/software/projects',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
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
            url: 'https://bible.jorgedoicela.com/bible/study/standard',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://bible.jorgedoicela.com/bible/study/parallel',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://bible.jorgedoicela.com/bible/study/interlinear',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://bible.jorgedoicela.com/bible/study/word-study',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://bible.jorgedoicela.com/bible/study/literary',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://bible.jorgedoicela.com/bible/study/historical-context',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
    ];

    // Servidor consolidado actual (1 GB RAM): todas las rutas juntas.
    // Al migrar, cada servidor retorna solo su bloque correspondiente.
    return [...landingRoutes, ...portfolioRoutes, ...softwareRoutes, ...bibleRoutes];
}
