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
    // 2. PORTAFOLIO (portfolio.jorgedoicela.com)
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
    // 3. DOICELADEV (doiceladev.jorgedoicela.com) — 8 Áreas
    // Al migrar a servidor independiente: copiar solo este bloque
    // en el sitemap.ts de la nueva app Next.js y borrar los demás.
    // ─────────────────────────────────────────────────────────────
    const doiceladevRoutes: MetadataRoute.Sitemap = [
        {
            url: 'https://doiceladev.jorgedoicela.com',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.95,
        },
        {
            url: 'https://doiceladev.jorgedoicela.com/llms.txt',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: 'https://doiceladev.jorgedoicela.com/news',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://doiceladev.jorgedoicela.com/blog',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://doiceladev.jorgedoicela.com/forum',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.85,
        },
        {
            url: 'https://doiceladev.jorgedoicela.com/ai',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://doiceladev.jorgedoicela.com/cybersecurity',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://doiceladev.jorgedoicela.com/tutorials',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://doiceladev.jorgedoicela.com/projects',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://doiceladev.jorgedoicela.com/infrastructure',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://doiceladev.jorgedoicela.com/infrastructure/firewall-linux-ufw-netfilter-seguridad-servidores',
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.85,
        },
    ];

    // ─────────────────────────────────────────────────────────────
    // 4. KARTEX (kartex.jorgedoicela.com) — 9 Módulos Especializados
    // Al migrar a servidor independiente: copiar solo este bloque
    // en el sitemap.ts de la nueva app Next.js y borrar los demás.
    // ─────────────────────────────────────────────────────────────
    const kartexRoutes: MetadataRoute.Sitemap = [
        {
            url: 'https://kartex.jorgedoicela.com',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.95,
        },
        {
            url: 'https://kartex.jorgedoicela.com/llms.txt',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: 'https://kartex.jorgedoicela.com/study/standard',
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://kartex.jorgedoicela.com/study/parallel',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://kartex.jorgedoicela.com/study/interlinear',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://kartex.jorgedoicela.com/study/word-study',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://kartex.jorgedoicela.com/study/atlas',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://kartex.jorgedoicela.com/study/timeline',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://kartex.jorgedoicela.com/study/archaeology',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: 'https://kartex.jorgedoicela.com/study/evangelism',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
    ];

    // Servidor consolidado actual (1 GB RAM): todas las rutas juntas.
    // Al migrar, cada servidor retorna solo su bloque correspondiente.
    return [...landingRoutes, ...portfolioRoutes, ...doiceladevRoutes, ...kartexRoutes];
}
