export type Language = 'es' | 'en';

export interface Translations {
    greetingPrefix: string;
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    toggleTheme: string;
    toggleLang: string;
    location: string;
    roles: string[];
    welcomeTitle: string;
    welcomeDescriptionParagraph1: string;
    welcomeDescriptionFaith: string;
    welcomeDescriptionParagraph2: string;
    
    cardBibleTag: string;
    cardBibleTitle: string;
    cardBibleDescription: string;
    cardBibleAction: string;
    cardBibleQuote: string;
    cardBibleVerseRef: string;

    cardSoftwareTag: string;
    cardSoftwareTitle: string;
    cardSoftwareDescription: string;
    cardSoftwareAction: string;
    cardSoftwareHighlights: string;
    cardSoftwareItem1: string;
    cardSoftwareItem1Tag: string;
    cardSoftwareItem2: string;
    cardSoftwareItem2Tag: string;
    cardSoftwareItem3: string;
    cardSoftwareItem3Tag: string;

    cardPortfolioTag: string;
    cardPortfolioTitle: string;
    cardPortfolioDescription: string;
    cardPortfolioAction: string;
    cardPortfolioItem1: string;
    cardPortfolioItem2: string;
    cardPortfolioItem3: string;

    cardContactTag: string;
    cardContactTitle: string;
    cardContactDescription: string;
    cardContactSub: string;

    cardPracticeTag: string;
    cardPracticeTitle: string;
    cardPracticeDescription: string;
    cardPracticeChip1: string;
    cardPracticeChip2: string;
    cardPracticeChip3: string;

    cardApproachTag: string;
    cardApproachQuote: string;

    footer: string;
}

export const translations: Record<Language, Translations> = {
    es: {
        greetingPrefix: '¡Bienvenido y bienvenida!',
        greetingMorning: '¡Bienvenido y bienvenida! Buenos días',
        greetingAfternoon: '¡Bienvenido y bienvenida! Buenas tardes',
        greetingEvening: '¡Bienvenido y bienvenida! Buenas noches',
        toggleTheme: 'Alternar tema',
        toggleLang: 'Cambiar a inglés',
        location: 'Quito, Ecuador',
        roles: [
            'DEVSECOPS, INTELIGENCIA ARTIFICIAL & CIBERSEGURIDAD',
            'FULL STACK DEVELOPER',
            'INGENIERÍA EN INTELIGENCIA ARTIFICIAL',
            'CIBERSEGURIDAD & CULTURA DEVSECOPS'
        ],
        welcomeTitle: 'Página Personal',
        welcomeDescriptionParagraph1: 'Te doy la bienvenida a mi espacio digital. Soy desarrollador de software y estudiante de Ingeniería en Inteligencia Artificial y Ciberseguridad, residiendo en Quito.',
        welcomeDescriptionFaith: 'Por sobre todas las cosas, soy cristiano y creyente en Dios',
        welcomeDescriptionParagraph2: ', y mi propósito es crear tecnología de excelencia que no solo solucione problemas complejos, sino que edifique a la comunidad y sea de utilidad para las personas, todo para la gloria de Dios.',
        
        cardBibleTag: 'Estudios & Recursos Bíblicos',
        cardBibleTitle: 'La Biblia',
        cardBibleDescription: 'Un ecosistema completo concebido para el estudio teológico, la evangelización y el crecimiento espiritual. Explora estudios bíblicos, libros, noticias y guías de ayuda espiritual creados para la gloria de Dios.',
        cardBibleAction: 'Explorar recursos',
        cardBibleQuote: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.',
        cardBibleVerseRef: 'Salmos 119:105',

        cardSoftwareTag: 'Portal de Tecnología',
        cardSoftwareTitle: 'Software & Noticias',
        cardSoftwareDescription: 'Un espacio dedicado a la publicación de noticias de software, últimas tendencias en inteligencia artificial, cultura DevSecOps, ciberseguridad y análisis técnicos de ingeniería de sistemas.',
        cardSoftwareAction: 'Entrar al portal',
        cardSoftwareHighlights: 'Destacados',
        cardSoftwareItem1: '01 / Modelos & IA',
        cardSoftwareItem1Tag: 'Noticias',
        cardSoftwareItem2: '02 / DevSecOps',
        cardSoftwareItem2Tag: 'Cultura',
        cardSoftwareItem3: '03 / Ciberseguridad',
        cardSoftwareItem3Tag: 'Defensa',

        cardPortfolioTag: 'Portafolio Profesional',
        cardPortfolioTitle: 'Trayectoria & Perfil',
        cardPortfolioDescription: 'Un recorrido completo por mi experiencia laboral, formación académica y proyectos desarrollados. Explora mi trayectoria de forma visual o interactúa mediante la consola virtual.',
        cardPortfolioAction: 'Explorar portafolio',
        cardPortfolioItem1: '01 / Proyectos & Skills',
        cardPortfolioItem2: '02 / Trayectoria & Exp',
        cardPortfolioItem3: '03 / Consola interactiva',

        cardContactTag: 'Canal de Contacto',
        cardContactTitle: 'Conectar con Jorge',
        cardContactDescription: 'Si tienes una idea, proyecto o simplemente deseas conversar sobre desarrollo de software, no dudes en contactarme.',
        cardContactSub: 'Canales directos',

        cardPracticeTag: 'Áreas de Práctica',
        cardPracticeTitle: 'Servicios Profesionales',
        cardPracticeDescription: 'Desarrollo de software de extremo a extremo, estructurando sistemas robustos, escalables y diseñando interfaces con una experiencia de usuario sumamente refinada.',
        cardPracticeChip1: 'Lógica / Sistemas',
        cardPracticeChip2: 'Interfaces / Frontend',
        cardPracticeChip3: 'Estructura / Arquitectura',

        cardApproachTag: 'Mi Enfoque',
        cardApproachQuote: '“Crear soluciones sencillas a problemas complejos. Priorizar la claridad, el rendimiento y la facilidad de uso para que el software sea verdaderamente valioso.”',

        footer: '© {year} Jorge Doicela. Todos los derechos reservados.'
    },
    en: {
        greetingPrefix: 'Welcome!',
        greetingMorning: 'Welcome! Good morning',
        greetingAfternoon: 'Welcome! Good afternoon',
        greetingEvening: 'Welcome! Good evening',
        toggleTheme: 'Toggle theme',
        toggleLang: 'Switch to Spanish',
        location: 'Quito, Ecuador',
        roles: [
            'DEVSECOPS, ARTIFICIAL INTELLIGENCE & CYBERSECURITY',
            'FULL STACK DEVELOPER',
            'ARTIFICIAL INTELLIGENCE ENGINEERING',
            'CYBERSECURITY & DEVSECOPS CULTURE'
        ],
        welcomeTitle: 'Personal Webpage',
        welcomeDescriptionParagraph1: 'Welcome to my digital space. I am a software developer and Artificial Intelligence & Cybersecurity Engineering student, based in Quito.',
        welcomeDescriptionFaith: 'Above all things, I am a Christian and a believer in God',
        welcomeDescriptionParagraph2: ', and my purpose is to create excellence in technology that not only solves complex problems but also edifies the community and serves people, all for the glory of God.',
        
        cardBibleTag: 'Bible Studies & Resources',
        cardBibleTitle: 'The Bible',
        cardBibleDescription: 'A complete ecosystem designed for theological study, evangelism, and spiritual growth. Explore Bible studies, books, news, and spiritual guidance tools created for the glory of God.',
        cardBibleAction: 'Explore resources',
        cardBibleQuote: 'Your word is a lamp to my feet and a light to my path.',
        cardBibleVerseRef: 'Psalms 119:105',

        cardSoftwareTag: 'Technology Portal',
        cardSoftwareTitle: 'Software & News',
        cardSoftwareDescription: 'A space dedicated to publishing software news, the latest trends in artificial intelligence, DevSecOps culture, cybersecurity, and technical systems engineering analysis.',
        cardSoftwareAction: 'Enter portal',
        cardSoftwareHighlights: 'Featured',
        cardSoftwareItem1: '01 / Models & AI',
        cardSoftwareItem1Tag: 'News',
        cardSoftwareItem2: '02 / DevSecOps',
        cardSoftwareItem2Tag: 'Culture',
        cardSoftwareItem3: '03 / Cybersecurity',
        cardSoftwareItem3Tag: 'Defense',

        cardPortfolioTag: 'Professional Portfolio',
        cardPortfolioTitle: 'Career & Profile',
        cardPortfolioDescription: 'A complete overview of my work experience, academic background, and personal projects. Explore my journey visually or interact via the virtual console.',
        cardPortfolioAction: 'Explore portfolio',
        cardPortfolioItem1: '01 / Projects & Skills',
        cardPortfolioItem2: '02 / Career & Experience',
        cardPortfolioItem3: '03 / Interactive Console',

        cardContactTag: 'Contact Channel',
        cardContactTitle: 'Connect with Jorge',
        cardContactDescription: 'If you have an idea, project, or simply want to chat about software development, feel free to reach out.',
        cardContactSub: 'Direct channels',

        cardPracticeTag: 'Practice Areas',
        cardPracticeTitle: 'Professional Services',
        cardPracticeDescription: 'End-to-end software development, structuring robust, scalable systems and designing interfaces with an exceptionally refined user experience.',
        cardPracticeChip1: 'Logic / Systems',
        cardPracticeChip2: 'Interfaces / Frontend',
        cardPracticeChip3: 'Structure / Architecture',

        cardApproachTag: 'My Approach',
        cardApproachQuote: '“Creating simple solutions to complex problems. Prioritizing clarity, performance, and usability so that software is genuinely valuable.”',

        footer: '© {year} Jorge Doicela. All rights reserved.'
    }
};
