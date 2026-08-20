import Database from 'better-sqlite3';

export function seedSoftware(dbPath: string = 'software.sqlite') {
  const startTime = Date.now();
  console.log(`[SoftwareSeeder] Conectando a la base de datos: ${dbPath}...`);

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Asegurar estructura de tablas relacionales si no existen
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      tags TEXT NOT NULL,
      coverImage TEXT NOT NULL,
      readTimeMinutes INTEGER NOT NULL DEFAULT 5,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS forum_topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      category TEXT NOT NULL,
      repliesCount INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      techStack TEXT NOT NULL,
      repoUrl TEXT NOT NULL,
      liveUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const seedTransaction = db.transaction(() => {
    // 1. Artículos Iniciales
    const insertArticle = db.prepare(`
      INSERT OR IGNORE INTO articles 
        (title, slug, excerpt, content, category, author, tags, coverImage, readTimeMinutes, views, likes)
      VALUES 
        (@title, @slug, @excerpt, @content, @category, @author, @tags, @coverImage, @readTimeMinutes, @views, @likes)
    `);

    const initialArticles = [
      {
        title: 'Novedades de Next.js 16 y el Futuro de React Server Components',
        slug: 'novedades-nextjs-16-react-server-components',
        excerpt:
          'Analisis tecnico sobre las mejoras de rendimiento, compilacion estatica y streaming acelerado en la ultima version de Next.js.',
        content: `Next.js 16 redefine el estandar de rendimiento en desarrollo web moderno. Con la integracion profunda de React 19 y optimizaciones en el compilador de server components, los desarrolladores pueden lograr TTFB ultra-bajos manteniendo un desacoplamiento limpio de la interfaz.

Aspectos Clave:
- Bundling optimizado con Turbopack.
- Reduccion del consumo de memoria en servidores Node.js.
- Soporte extendido para Server Actions y validacion de tipos defensiva.`,
        category: 'news',
        author: 'Jorge Doicela',
        tags: 'nextjs,react,web,performance',
        coverImage: '/software/images/nextjs16.jpg',
        readTimeMinutes: 5,
        views: 142,
        likes: 38,
      },
      {
        title: 'Arquitectura Limpia y Monolitos Modulares en NestJS',
        slug: 'arquitectura-limpia-monolitos-modulares-nestjs',
        excerpt:
          'Como estructurar aplicaciones escalables con bases de datos desacopladas preparadas para migrar a microservicios sin acoplamiento tecnico.',
        content: `El patron de Monolito Modular permite a equipos pequenos construir sistemas de alto rendimiento en infraestructuras limitadas (como VPS de 1 GB de RAM) manteniendo cajas negras desacopladas.

Principios Clave:
1. Cero importaciones cruzadas entre dominios de negocio.
2. Persistencia fisica independiente usando multiples archivos SQLite o schemas relacionales.
3. Comunicacion interna asincrona mediante un despachador de eventos local (Event Emitter).`,
        category: 'blog',
        author: 'Jorge Doicela',
        tags: 'nestjs,architecture,clean-code,typescript',
        coverImage: '/software/images/architecture.jpg',
        readTimeMinutes: 8,
        views: 295,
        likes: 74,
      },
      {
        title: 'Agentes Autonomos con LLMs: El Presente de la IA Agentic',
        slug: 'agentes-autonomos-llms-ia-agentic',
        excerpt:
          'Explorando como los agentes inteligentes razonan, ejecutan herramientas y resuelven tareas complejas de ingenieria de software de forma autonoma.',
        content: `La evolucion de la Inteligencia Artificial se traslada de las respuestas estaticas de texto a los bucles autonomos de accion y reflexion (ReAct).

Un agente moderno integra:
- Planificacion estrategica basada en objetivos.
- Ejecucion segura de comandos y analisis de codigo.
- Memoria contextual distribuida mediante Knowledge Items (KI) y embeddings.`,
        category: 'ai',
        author: 'Jorge Doicela',
        tags: 'ai,llm,agents,deep-learning,python',
        coverImage: '/software/images/ai-agents.jpg',
        readTimeMinutes: 6,
        views: 410,
        likes: 112,
      },
      {
        title:
          'Guia Practica de Bastionado SSH y Seguridad en Servidores Linux',
        slug: 'guia-bastionado-ssh-seguridad-linux',
        excerpt:
          'Estrategias defensivas esenciales para proteger servidores Cloud de ataques de fuerza bruta y escaneos de puertos no autorizados.',
        content: `La seguridad defensiva comienza en el control de acceso al sistema operativo.

Pasos fundamentales:
1. Deshabilitar completamente la autenticacion por contrasena (PasswordAuthentication no).
2. Permitir unicamente el ingreso mediante llaves criptograficas Ed25519 o RSA de 4096 bits.
3. Configurar firewall perimetral y limitar el acceso a la red interna.`,
        category: 'cybersecurity',
        author: 'Jorge Doicela',
        tags: 'cybersecurity,linux,ssh,devsecops,security',
        coverImage: '/software/images/cybersecurity.jpg',
        readTimeMinutes: 7,
        views: 188,
        likes: 56,
      },
      {
        title:
          'Tutorial: Construyendo una Terminal SSH Virtual con WebSockets en React',
        slug: 'tutorial-terminal-ssh-virtual-websockets-react',
        excerpt:
          'Paso a paso para implementar una consola interactiva en tiempo real utilizando Socket.io y React Hooks.',
        content: `En este tutorial aprenderas a conectar una interfaz frontend en React con un gateway de WebSockets en NestJS para simular comandos Unix interactivos.

Pasos:
- Configurar el cliente socket.io-client en un custom hook (useTerminalSocket).
- Capturar eventos de entrada y salida sin bloqueo del bucle principal.
- Aplicar secuencias de escape ANSI para coloreado de texto.`,
        category: 'tutorial',
        author: 'Jorge Doicela',
        tags: 'tutorial,react,websockets,typescript,frontend',
        coverImage: '/software/images/tutorial-terminal.jpg',
        readTimeMinutes: 10,
        views: 320,
        likes: 89,
      },
    ];

    for (const article of initialArticles) {
      insertArticle.run(article);
    }

    // 2. Temas de Foro Iniciales
    const insertTopic = db.prepare(`
      INSERT OR IGNORE INTO forum_topics
        (title, slug, content, author, category, repliesCount, views)
      VALUES
        (@title, @slug, @content, @author, @category, @repliesCount, @views)
    `);

    const initialTopics = [
      {
        title:
          '¿Cual es la mejor estrategia para gestionar el estado global en aplicaciones Next.js App Router?',
        slug: 'estrategia-estado-global-nextjs-app-router',
        content:
          'Debate abierto sobre el uso de React Context vs Zustand vs React Query / Server Actions para aplicaciones de mediano y gran tamano.',
        author: 'Alex Dev',
        category: 'frontend',
        repliesCount: 14,
        views: 185,
      },
      {
        title:
          'Buenas practicas de optimizacion de RAM en servidores VPS de 1GB para proyectos Node.js',
        slug: 'optimizacion-ram-vps-1gb-nodejs',
        content:
          'En entornos de produccion limitados, reducir la huella de memoria de Node.js es vital. ¿Que tecnicas han utilizado con mejores resultados?',
        author: 'Jorge Doicela',
        category: 'devops',
        repliesCount: 22,
        views: 340,
      },
      {
        title:
          'Impacto de la Inteligencia Artificial Generativa en la Ciberseguridad Defensiva',
        slug: 'impacto-ia-generativa-ciberseguridad-defensiva',
        content:
          'Analicemos como la IA esta cambiando la deteccion de anomalias y el analisis de logs en tiempo real.',
        author: 'SecResearcher',
        category: 'cybersecurity',
        repliesCount: 9,
        views: 210,
      },
    ];

    for (const topic of initialTopics) {
      insertTopic.run(topic);
    }

    // 3. Proyectos Iniciales
    const insertProject = db.prepare(`
      INSERT OR IGNORE INTO projects
        (name, description, techStack, repoUrl, liveUrl)
      VALUES
        (@name, @description, @techStack, @repoUrl, @liveUrl)
    `);

    const initialProjects = [
      {
        name: 'Portafolio Personal',
        description:
          'Mi sitio web personal interactivo con terminal virtual SSH integrada.',
        techStack: 'Next.js, TailwindCSS, Socket.io, NestJS',
        repoUrl: 'https://github.com/jorge/portfolio',
        liveUrl: 'https://jorgedoicela.com',
      },
      {
        name: 'Biblia Modular',
        description:
          'Un motor de consulta y lectura de la Biblia con 9 motores de estudio exegetico.',
        techStack: 'Next.js, NestJS, SQLite, TypeORM',
        repoUrl: 'https://github.com/jorge/bible-app',
        liveUrl: 'https://bible.jorgedoicela.com',
      },
      {
        name: 'Software Hub',
        description:
          'Plataforma comunitaria de articulos tecnicos, foros y catalogo de proyectos de IA y seguridad.',
        techStack: 'Next.js, NestJS, SQLite, TypeORM',
        repoUrl: 'https://github.com/jorge/software-hub',
        liveUrl: 'https://software.jorgedoicela.com',
      },
    ];

    for (const project of initialProjects) {
      insertProject.run(project);
    }
  });

  seedTransaction();
  db.close();

  console.log(
    `[SoftwareSeeder] Sembrado de Software completado con exito en ${Date.now() - startTime}ms.`,
  );
}

if (require.main === module) {
  const dbFile = process.env.SOFTWARE_DB_PATH || 'software.sqlite';
  seedSoftware(dbFile);
}
