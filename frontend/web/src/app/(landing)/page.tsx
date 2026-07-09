'use client';

import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [links, setLinks] = useState({
    portfolio: 'https://portfolio.jorgedoicela.com',
    bible: 'https://bible.jorgedoicela.com',
    software: 'https://software.jorgedoicela.com',
  });

  useEffect(() => {
    const host = window.location.host;
    // Si estamos en desarrollo local, configuramos subdominios locales (por ejemplo, bible.localhost:3001)
    if (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('26.')) {
      const hostname = host.split(':')[0];
      const port = window.location.port ? `:${window.location.port}` : '';
      
      // Intentamos usar .localhost que es resuelto automáticamente a 127.0.0.1 por la mayoría de navegadores modernos
      setLinks({
        portfolio: `http://portfolio.localhost${port}`,
        bible: `http://bible.localhost${port}`,
        software: `http://software.localhost${port}`,
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]"></div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
          JD
        </div>
        <div className="text-sm text-slate-500 font-mono">
          v1.0.0 // standalone_mode
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto px-6 py-12 flex-grow flex flex-col justify-center">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 mb-6">
            Jorge Doicela
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Arquitectura de software limpia, modular y de alto rendimiento. Selecciona uno de mis proyectos interactivos a continuación:
          </p>
        </div>

        {/* Tarjetas de Proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta Portfolio */}
          <a
            href={links.portfolio}
            className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md hover:border-violet-500/50 hover:bg-slate-900/60 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-violet-950/20"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2 group-hover:text-violet-400 transition-colors duration-200">
                Portafolio
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Terminal interactiva virtual simulada sobre WebSockets. Conéctate directamente a mi entorno virtual para explorar mi experiencia.
              </p>
            </div>
            <div className="mt-8 flex items-center text-xs text-violet-400 font-mono gap-1">
              <span>EXPLORAR TERMINAL</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </a>

          {/* Tarjeta Biblia */}
          <a
            href={links.bible}
            className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-indigo-950/20"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors duration-200">
                Biblia Digital
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Frontend minimalista e intuitivo diseñado para una experiencia de lectura fluida y consultas teológicas sin distracciones.
              </p>
            </div>
            <div className="mt-8 flex items-center text-xs text-indigo-400 font-mono gap-1">
              <span>INICIAR LECTURA</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </a>

          {/* Tarjeta Software */}
          <a
            href={links.software}
            className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-emerald-950/20"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors duration-200">
                Software
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Galería y vitrina interactiva de mis sistemas, bibliotecas y herramientas open source más representativas.
              </p>
            </div>
            <div className="mt-8 flex items-center text-xs text-emerald-400 font-mono gap-1">
              <span>VER PROYECTOS</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </a>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 text-center text-slate-600 text-xs font-mono border-t border-slate-900/80">
        Jorge Doicela &copy; {new Date().getFullYear()} // Monorepo modular optimizado para VPS
      </footer>
    </div>
  );
}
