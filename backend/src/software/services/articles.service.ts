import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleCategory } from '../entities/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';

@Injectable()
export class ArticlesService implements OnModuleInit {
  constructor(
    @InjectRepository(Article, 'softwareConnection')
    private readonly articleRepository: Repository<Article>,
  ) {}

  async onModuleInit() {
    await this.seedInitialArticles();
  }

  private async seedInitialArticles() {
    const count = await this.articleRepository.count();
    if (count > 0) return;

    const initialArticles: Partial<Article>[] = [
      {
        title: 'Novedades de Next.js 16 y el Futuro de React Server Components',
        slug: 'novedades-nextjs-16-react-server-components',
        excerpt:
          'Análisis técnico sobre las mejoras de rendimiento, compilación estática y streaming acelerado en la última versión de Next.js.',
        content: `Next.js 16 redefine el estándar de rendimiento en desarrollo web moderno. Con la integración profunda de React 19 y optimizaciones en el compilador de server components, los desarrolladores pueden lograr TTFB ultra-bajos manteniendo un desacoplamiento limpio de la interfaz.

Key Highlights:
- Bundling optimizado con Turbopack.
- Reducción del consumo de memoria en servidores Node.js.
- Soporte extendido para Server Actions y validación de tipos defensiva.`,
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
          'Cómo estructurar aplicaciones escalables con bases de datos desacopladas preparadas para migrar a microservicios sin acoplamiento técnico.',
        content: `El patrón de Monolito Modular permite a equipos pequeños construir sistemas de alto rendimiento en infraestructuras limitadas (como VPS de 1 GB de RAM) manteniendo cajas negras desacopladas.

Principios Clave:
1. Cero importaciones cruzadas entre dominios de negocio.
2. Persistencia física independiente usando múltiples archivos SQLite o schemas relacionales.
3. Comunicación interna asíncrona mediante un despachador de eventos local (Event Emitter).`,
        category: 'blog',
        author: 'Jorge Doicela',
        tags: 'nestjs,architecture,clean-code,typescript',
        coverImage: '/software/images/architecture.jpg',
        readTimeMinutes: 8,
        views: 295,
        likes: 74,
      },
      {
        title: 'Agentes Autónomos con LLMs: El Presente de la IA Agentic',
        slug: 'agentes-autonomos-llms-ia-agentic',
        excerpt:
          'Explorando cómo los agentes inteligentes razonan, ejecutan herramientas y resuelven tareas complejas de ingeniería de software de forma autónoma.',
        content: `La evolución de la Inteligencia Artificial se traslada de las respuestas estáticas de texto a los bucles autónomos de acción y reflexión (ReAct).

Un agente moderno integra:
- Planificación estratégica basada en objetivos.
- Ejecución segura de comandos y análisis de código.
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
          'Guía Práctica de Bastionado SSH y Seguridad en Servidores Linux',
        slug: 'guia-bastionado-ssh-seguridad-linux',
        excerpt:
          'Estrategias defensivas esenciales para proteger servidores Cloud de ataques de fuerza bruta y escaneos de puertos no autorizados.',
        content: `La seguridad defensiva comienza en el control de acceso al sistema operativo.

Pasos fundamentales:
1. Deshabilitar completamente la autenticación por contraseña (\`PasswordAuthentication no\`).
2. Permitir únicamente el ingreso mediante llaves criptográficas Ed25519 o RSA de 4096 bits.
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
        content: `En este tutorial aprenderás a conectar una interfaz frontend en React con un gateway de WebSockets en NestJS para simular comandos Unix interactivos.

Pasos:
- Configurar el cliente \`socket.io-client\` en un custom hook (\`useTerminalSocket\`).
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

    for (const articleData of initialArticles) {
      await this.articleRepository.save(
        this.articleRepository.create(articleData),
      );
    }
  }

  async findAll(
    category?: ArticleCategory,
    search?: string,
  ): Promise<Article[]> {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    if (category) {
      queryBuilder.andWhere('article.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(article.title LIKE :search OR article.excerpt LIKE :search OR article.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('article.createdAt', 'DESC');
    return queryBuilder.getMany();
  }

  async findOne(idOrSlug: string): Promise<Article> {
    const isId = !isNaN(Number(idOrSlug));
    const article = isId
      ? await this.articleRepository.findOne({
          where: { id: Number(idOrSlug) },
        })
      : await this.articleRepository.findOne({ where: { slug: idOrSlug } });

    if (!article) {
      throw new NotFoundException(
        `Artículo con ID o slug "${idOrSlug}" no fue encontrado`,
      );
    }

    // Incrementar contador de visualizaciones
    article.views += 1;
    await this.articleRepository.save(article);

    return article;
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create({
      ...createArticleDto,
      category: createArticleDto.category as ArticleCategory,
    });
    return await this.articleRepository.save(article);
  }

  async remove(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }
}
