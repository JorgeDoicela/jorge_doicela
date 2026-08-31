'use client';

import React, { useState } from 'react';
import { Plus, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AppleDetailExplorer: React.FC = () => {
    const { language } = useLanguage();
    const [activeItem, setActiveItem] = useState<number>(0);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const isEs = language === 'es';

    const details = [
        {
            id: 'platforms',
            navTitle: isEs ? '3 Plataformas de Software' : '3 Software Platforms',
            title: isEs ? '3 Plataformas en Producción' : '3 Live Platforms',
            description: isEs
                ? 'Un portal maestro que conecta tres plataformas independientes concebidas para distintas necesidades: estudio bíblico profundo, software con IA y servicios de ingeniería.'
                : 'A master portal connecting three independent platforms designed for distinct needs: in-depth bible study, AI software, and professional engineering services.',
            renderScreen: () => (
                <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-card text-foreground font-sans select-none text-left transition-colors duration-300">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground">
                            {isEs ? 'Plataformas de Software Propias' : 'Proprietary Software Platforms'}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                            {isEs
                                ? 'Tres portales especializados conectados desde un único punto de acceso.'
                                : 'Three specialized platforms connected from a single entry point.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-card-border pt-3 md:pt-4 border-t border-card-border my-auto">
                        <div className="flex flex-col gap-0.5 sm:gap-1 pr-2 sm:pr-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {isEs ? 'La Biblia' : 'The Bible'}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {isEs ? 'Estudio bíblico y exégesis teológica.' : 'Bible study & theological exegesis.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 px-2 sm:px-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                Software
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {isEs ? 'IA, tecnología y herramientas web.' : 'AI, tech, and web tools.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 pl-2 sm:pr-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                Portafolio
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {isEs ? 'Ingeniería y arquitectura de software.' : 'Engineering and software architecture.'}
                            </p>
                        </div>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-text-muted pt-2 sm:pt-3 border-t border-card-border">
                        {isEs ? 'Acceso rápido y directo a cada plataforma independiente.' : 'Quick and direct access to each independent platform.'}
                    </div>
                </div>
            ),
        },
        {
            id: 'innovation',
            navTitle: isEs ? 'Inteligencia Artificial & Software' : 'AI & Software Innovation',
            title: isEs ? 'Inteligencia Artificial & Software' : 'AI & Software Innovation',
            description: isEs
                ? 'Herramientas interactivas, modelos de lenguaje de última generación y arquitecturas de razonamiento construidas para potenciar el aprendizaje y la productividad.'
                : 'Interactive tools, state-of-the-art LLM architectures, and reasoning models engineered to boost learning and productivity.',
            renderScreen: () => (
                <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-card text-foreground font-sans select-none text-left transition-colors duration-300">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground">
                            {isEs ? 'Software & Inteligencia Artificial' : 'Software & Artificial Intelligence'}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                            {isEs
                                ? 'Noticias de vanguardia, análisis de modelos de razonamiento y herramientas interactivas.'
                                : 'Cutting-edge news, reasoning model analysis, and interactive tools.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-card-border pt-3 md:pt-4 border-t border-card-border my-auto">
                        <div className="flex flex-col gap-0.5 sm:gap-1 pr-3 sm:pr-6">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {isEs ? 'IA & Modelos' : 'AI & Models'}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {isEs
                                    ? 'Inferencia, agentes autónomos y análisis de LLMs.'
                                    : 'Inference, autonomous agents, and LLM evaluations.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 pl-3 sm:pl-6">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {isEs ? 'Ciberdefensa' : 'Cyberdefense'}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {isEs
                                    ? 'Análisis de vulnerabilidades y seguridad digital.'
                                    : 'Vulnerability analysis and digital security.'}
                            </p>
                        </div>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-text-muted pt-2 sm:pt-3 border-t border-card-border">
                        {isEs ? 'Tecnología moderna aplicada con rigor técnico.' : 'Modern technology applied with technical craftsmanship.'}
                    </div>
                </div>
            ),
        },
        {
            id: 'faith',
            navTitle: isEs ? 'Fe Cristiana & Excelencia' : 'Christian Faith & Values',
            title: isEs ? 'Fe Cristiana & Excelencia' : 'Christian Faith & Values',
            description: isEs
                ? 'Cada proyecto y línea de código se construye sobre principios de honestidad, integridad y excelencia técnica, poniendo los talentos al servicio del prójimo.'
                : 'Every project and line of code is built upon principles of honesty, integrity, and craftsmanship, putting gifts at the service of others.',
            renderScreen: () => (
                <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-card text-foreground font-sans select-none text-left transition-colors duration-300">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground">
                            {isEs ? 'Fe Cristiana & Principios' : 'Christian Faith & Principles'}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                            {isEs
                                ? 'Ingeniería de software fundamentada en principios bíblicos y ética profesional.'
                                : 'Software engineering grounded in biblical principles and craftsmanship.'}
                        </p>
                    </div>

                    <div className="pt-3 md:pt-4 border-t border-card-border my-auto">
                        <p className="text-xs sm:text-sm md:text-base font-light italic text-foreground leading-relaxed">
                            &ldquo;{isEs ? 'Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.' : 'Whatever you do, work heartily, as for the Lord and not for men.'}&rdquo;
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-text-muted mt-1.5">
                            Salmos 119:105 · Colosenses 3:23
                        </p>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-text-muted pt-2 sm:pt-3 border-t border-card-border">
                        {isEs ? 'La excelencia técnica como vocación de servicio.' : 'Technical excellence as a vocation of service.'}
                    </div>
                </div>
            ),
        },
        {
            id: 'experience',
            navTitle: isEs ? 'Experiencia & Interactividad' : 'UX & Interactivity',
            title: isEs ? 'Experiencia & Interactividad' : 'UX & Interactivity',
            description: isEs
                ? 'Interfaces limpias con soporte bilingüe (Español/Inglés), modo claro y oscuro instantáneo, tipografía precisa y adaptabilidad completa a cualquier pantalla.'
                : 'Clean interfaces with bilingual support (Spanish/English), instant light/dark mode, crisp typography, and full responsiveness.',
            renderScreen: () => (
                <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-card text-foreground font-sans select-none text-left transition-colors duration-300">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground">
                            {isEs ? 'Diseño Inmersivo & Accesible' : 'Immersive & Accessible Design'}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                            {isEs
                                ? 'Interfaces limpias concebidas para una experiencia de lectura cómoda.'
                                : 'Clean interfaces designed for a comfortable reading experience.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-card-border pt-3 md:pt-4 border-t border-card-border my-auto">
                        <div className="flex flex-col gap-0.5 sm:gap-1 pr-2 sm:pr-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {isEs ? 'Velocidad' : 'Speed'}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed">
                                {isEs ? 'Carga inmediata.' : 'Instant load.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 px-2 sm:px-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {isEs ? 'Bilingüe' : 'Bilingual'}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed">
                                {isEs ? 'Español / Inglés.' : 'Spanish / English.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 pl-2 sm:pr-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {isEs ? 'Adaptable' : 'Responsive'}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed">
                                {isEs ? 'Multi-dispositivo.' : 'Multi-device.'}
                            </p>
                        </div>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-text-muted pt-2 sm:pt-3 border-t border-card-border">
                        {isEs ? 'Sincronización instantánea de tema claro y oscuro.' : 'Instant light and dark theme synchronization.'}
                    </div>
                </div>
            ),
        },
        {
            id: 'security',
            navTitle: isEs ? 'Seguridad & Privacidad' : 'Security & Privacy',
            title: isEs ? 'Seguridad & Privacidad' : 'Security & Privacy',
            description: isEs
                ? 'Plataformas construidas con altos estándares de ciberseguridad, arquitectura en 1 GB de RAM, Cloudflare mTLS y privacidad estricta.'
                : 'Platforms engineered with high cybersecurity standards, 1 GB RAM architecture, Cloudflare mTLS, and privacy by design.',
            renderScreen: () => (
                <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-card text-foreground font-sans select-none text-left transition-colors duration-300">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground">
                            {isEs ? 'Seguridad & Confianza Digital' : 'Security & Digital Trust'}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                            {isEs
                                ? 'Protección proactiva de datos y privacidad garantizada desde el diseño.'
                                : 'Proactive data protection and privacy guaranteed by design.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-card-border pt-3 md:pt-4 border-t border-card-border my-auto">
                        <div className="flex flex-col gap-0.5 sm:gap-1 pr-3 sm:pr-6">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {isEs ? 'Privacidad' : 'Privacy'}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {isEs
                                    ? 'Sin anuncios invasivos ni venta de datos.'
                                    : 'No ads or commercial data selling.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 pl-3 sm:pl-6">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {isEs ? 'Conexiones' : 'Connections'}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {isEs
                                    ? 'Cifrado moderno de extremo a extremo.'
                                    : 'Modern end-to-end encryption.'}
                            </p>
                        </div>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-text-muted pt-2 sm:pt-3 border-t border-card-border">
                        {isEs ? 'Un entorno digital seguro y transparente.' : 'A secure and transparent digital environment.'}
                    </div>
                </div>
            ),
        },
    ];

    const renderWelcomeScreen = () => (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 bg-card text-foreground font-sans select-none text-center transition-colors duration-300 relative overflow-hidden">
            {/* Halo etéreo sutil */}
            <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none opacity-60" />

            {/* Tipografía de Bienvenida Estilo Apple Hello */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                    {isEs ? 'Bienvenido' : 'Welcome'}
                </h3>
            </div>
        </div>
    );

    const total = details.length;

    const handleNext = () => {
        setActiveItem((prev) => (prev + 1) % total);
        setIsExpanded(true);
    };

    const handlePrev = () => {
        setActiveItem((prev) => (prev - 1 + total) % total);
        setIsExpanded(true);
    };

    const current = details[activeItem];

    return (
        <section className="w-screen relative left-1/2 -translate-x-1/2 flex flex-col gap-6 py-6 sm:py-8 overflow-hidden px-4 sm:px-8 max-w-[1280px]">
            {/* Título de Sección Estilo Apple */}
            <div className="w-full flex flex-col items-start px-2 sm:px-4">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-foreground leading-tight">
                    {isEs ? 'Mírala en detalle' : 'Take a closer look'}
                </h2>
            </div>

            {/* Tarjeta Inspector Amplia Estilo Apple */}
            <div className="w-full rounded-[2rem] sm:rounded-[2.4rem] md:rounded-[2.8rem] bg-card border border-card-border p-5 sm:p-8 md:p-12 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between min-h-[520px] md:min-h-[560px]">
                {/* Botón de Cerrar / Reset en Esquina Superior Derecha */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 rounded-full bg-btn-sec border border-card-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all cursor-pointer z-20"
                    aria-label={isExpanded ? 'Cerrar detalle' : 'Abrir detalle'}
                >
                    <X className="w-4 h-4" />
                </button>

                {/* ========================================================================= */}
                {/* 1. VISTA ESCRITORIO (>= lg): Lado a lado (Píldoras a la izquierda, Laptop a la derecha) */}
                {/* ========================================================================= */}
                <div className="hidden lg:grid grid-cols-12 gap-8 md:gap-12 items-center flex-grow">
                    {/* COLUMNA IZQUIERDA: Píldoras de Navegación + Bocadillo Expandido estilo Apple */}
                    <div className="col-span-5 flex items-start gap-3">
                        {/* Flechas Arriba / Abajo */}
                        <div className="flex flex-col gap-1.5 shrink-0 pt-1">
                            <button
                                onClick={handlePrev}
                                className="w-7 h-7 rounded-full bg-btn-sec border border-card-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all cursor-pointer"
                                aria-label="Anterior característica"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-7 h-7 rounded-full bg-btn-sec border border-card-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all cursor-pointer"
                                aria-label="Siguiente característica"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Píldoras y Tarjeta Expandida */}
                        <div className="flex flex-col gap-2.5 w-full">
                            {details.map((item, idx) => {
                                const isActive = isExpanded && idx === activeItem;

                                if (isActive && isExpanded) {
                                    return (
                                        <div
                                            key={item.id}
                                            className="rounded-2xl bg-btn-sec border border-card-border p-4 sm:p-5 flex flex-col gap-2 shadow-sm animate-fade-slide"
                                        >
                                            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                                                <span className="font-semibold">{item.title}. </span>
                                                <span className="text-text-muted font-normal">{item.description}</span>
                                            </p>
                                        </div>
                                    );
                                }

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveItem(idx);
                                            setIsExpanded(true);
                                        }}
                                        className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 text-left w-fit cursor-pointer ${isActive
                                            ? 'bg-foreground text-background shadow-sm'
                                            : 'bg-btn-sec text-foreground hover:bg-btn-sec-hover border border-card-border'
                                            }`}
                                    >
                                        <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0">
                                            <Plus className="w-2.5 h-2.5" />
                                        </div>
                                        <span>{item.navTitle}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: MacBook Pro con Transición Cinemática */}
                    <div className="col-span-7 w-full flex items-center justify-center py-4">
                        <div className="w-full max-w-[580px] flex flex-col items-center">
                            {/* Tapa / Bisel Superior de la Pantalla */}
                            <div className="w-full aspect-[16/10] rounded-t-2xl sm:rounded-t-3xl bg-card border-[6px] sm:border-[8px] border-card-border relative overflow-hidden shadow-md flex flex-col transition-colors duration-300">
                                {/* Cámara Notch Sutil */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-3 sm:h-3.5 bg-card rounded-b-md z-30 flex items-center justify-center border-b border-x border-card-border transition-colors duration-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-text-muted/40" />
                                </div>

                                {/* Pantalla con Transición de Fundido Suave */}
                                <div className="w-full h-full flex-grow relative overflow-hidden">
                                    <div key={isExpanded ? current.id : 'welcome'} className="w-full h-full animate-fade-slide">
                                        {isExpanded ? current.renderScreen() : renderWelcomeScreen()}
                                    </div>
                                </div>
                            </div>

                            {/* Base de la Laptop */}
                            <div className="w-[105%] h-3 sm:h-3.5 bg-card border border-t-0 border-card-border rounded-b-lg relative flex items-start justify-center transition-colors duration-300">
                                <div className="w-12 sm:w-16 h-1 bg-card-border rounded-b" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* 2. VISTA MÓVIL (< lg): Apple Official Mobile Layout */}
                {/* ========================================================================= */}
                <div className="flex lg:hidden flex-col justify-between gap-6 flex-grow pt-2">
                    {/* Laptop Centrada en la parte superior */}
                    <div className="w-full flex items-center justify-center pt-2 pb-1">
                        <div className="w-full max-w-[360px] flex flex-col items-center">
                            {/* Pantalla Laptop */}
                            <div className="w-full aspect-[16/10] rounded-t-2xl bg-card border-[5px] border-card-border relative overflow-hidden shadow-sm flex flex-col transition-colors duration-300">
                                {/* Cámara Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-card rounded-b z-30 flex items-center justify-center border-b border-x border-card-border">
                                    <div className="w-1 h-1 rounded-full bg-text-muted/40" />
                                </div>

                                {/* Contenido de Pantalla con Animación */}
                                <div className="w-full h-full flex-grow relative overflow-hidden">
                                    <div key={isExpanded ? current.id : 'welcome'} className="w-full h-full animate-fade-slide">
                                        {isExpanded ? current.renderScreen() : renderWelcomeScreen()}
                                    </div>
                                </div>
                            </div>

                            {/* Base de Laptop */}
                            <div className="w-[105%] h-2.5 bg-card border border-t-0 border-card-border rounded-b-md relative flex items-start justify-center">
                                <div className="w-10 h-0.5 bg-card-border rounded-b" />
                            </div>
                        </div>
                    </div>

                    {/* Área Inferior: Alternancia entre Bocadillo con Flechas Flotantes (< >) o Barra de Píldoras */}
                    <div className="w-full min-h-[100px] flex items-center justify-center px-4">
                        {isExpanded ? (
                            /* Modo Detalle Abierto: Bocadillo con bordes super redondeados y flechas flotantes laterales */
                            <div className="relative w-full max-w-[380px] mx-auto animate-fade-slide">
                                {/* Flecha Izquierda Flotante */}
                                <button
                                    onClick={handlePrev}
                                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-btn-sec border border-card-border flex items-center justify-center text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all shadow-md z-20 cursor-pointer"
                                    aria-label="Anterior característica"
                                >
                                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                                </button>

                                {/* Bocadillo Descriptivo Apple Style */}
                                <div className="w-full rounded-[1.8rem] bg-btn-sec border border-card-border p-5 sm:p-6 text-left shadow-sm backdrop-blur-2xl">
                                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                                        <span className="font-semibold">{current.title}. </span>
                                        <span className="text-text-muted font-normal">{current.description}</span>
                                    </p>
                                </div>

                                {/* Flecha Derecha Flotante */}
                                <button
                                    onClick={handleNext}
                                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-btn-sec border border-card-border flex items-center justify-center text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all shadow-md z-20 cursor-pointer"
                                    aria-label="Siguiente característica"
                                >
                                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                                </button>
                            </div>
                        ) : (
                            /* Modo Replegado: Barra de Píldoras Horizontales Deslizables */
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 w-full animate-fade-slide justify-start">
                                {details.map((item, idx) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveItem(idx);
                                            setIsExpanded(true);
                                        }}
                                        className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium bg-btn-sec text-foreground hover:bg-btn-sec-hover border border-card-border transition-all whitespace-nowrap cursor-pointer active:scale-95"
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center shrink-0">
                                            <Plus className="w-2 h-2" />
                                        </div>
                                        <span>{item.navTitle}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
