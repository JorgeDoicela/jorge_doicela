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
      const port = window.location.port ? `:${window.location.port}` : '';
      
      setLinks({
        portfolio: `http://portfolio.localhost${port}`,
        bible: `http://bible.localhost${port}`,
        software: `http://software.localhost${port}`,
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-x-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-zinc-100 py-12 md:py-16">
      
      {/* Main Content: Bento Grid Puro Refinado */}
      <main className="w-full max-w-6xl mx-auto px-6 z-10 flex flex-col justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto lg:grid-rows-3 lg:h-[620px] w-full">
          
          {/* 1. PERFIL / BIOGRAFÍA (Cols 1-2, Rows 1-2 en desktop) - PASIVA */}
          <div className="md:col-span-2 md:row-span-2 flex flex-col justify-between p-8 rounded-3xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md shadow-sm min-h-[280px]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-zinc-100">
                  Jorge Doicela
                </h1>
                <p className="text-sm text-zinc-400 tracking-wide font-light">
                  Arquitecto de Software & Diseñador de Sistemas
                </p>
              </div>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light max-w-md mt-2">
                Desarrollo sistemas estructurados bajo principios de modularidad, aislamiento de datos y portabilidad absoluta. Mi enfoque prioriza la sobriedad en la ejecución y la simplicidad en el diseño.
              </p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono tracking-wider">
              <span>QUITO, ECUADOR</span>
              <span>© 2026</span>
            </div>
          </div>

          {/* 2. BIBLIA (Col 3, Rows 1-2 en desktop) - INTERACTIVA */}
          <a
            href={links.bible}
            className="group md:col-span-1 md:row-span-2 flex flex-col justify-between p-8 rounded-3xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md hover:border-zinc-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm min-h-[280px]"
          >
            <div>
              <h2 className="text-xl font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors duration-200 mb-3">
                Biblia
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-8 font-light">
                Un entorno digital minimalista concebido para la lectura reflexiva y el estudio teológico, donde el texto prevalece libre de distracciones.
              </p>
              
              <div className="py-4 border-y border-zinc-900/60 font-serif text-zinc-400 text-sm italic leading-relaxed text-center">
                "Lámpara es a mis pies tu palabra..."
              </div>
            </div>

            <div className="mt-8 flex items-center text-xs text-zinc-400 group-hover:text-zinc-200 font-mono tracking-wider gap-1 transition-colors duration-300">
              <span>LEER ESCRITURA</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </a>

          {/* 3. SISTEMAS / SOFTWARE (Col 4, Rows 1-2 en desktop) - INTERACTIVA */}
          <a
            href={links.software}
            className="group md:col-span-1 md:row-span-2 flex flex-col justify-between p-8 rounded-3xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md hover:border-zinc-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm min-h-[280px]"
          >
            <div>
              <h2 className="text-xl font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors duration-200 mb-3">
                Software
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-8 font-light">
                Galería de herramientas, módulos independientes y soluciones de código abierto enfocadas en el rendimiento, la eficiencia y la reusabilidad.
              </p>
            </div>

            <div className="mt-8 flex items-center text-xs text-zinc-400 group-hover:text-zinc-200 font-mono tracking-wider gap-1 transition-colors duration-300">
              <span>VER PROYECTOS</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </a>

          {/* 4. PORTAFOLIO INTERACTIVO (Cols 1-2, Row 3 en desktop) - INTERACTIVA */}
          <a
            href={links.portfolio}
            className="group md:col-span-2 md:row-span-1 flex flex-col justify-between p-8 rounded-3xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md hover:border-zinc-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm min-h-[140px]"
          >
            <div>
              <h2 className="text-lg font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors duration-200">
                Portafolio
              </h2>
              <p className="text-zinc-400 text-xs font-light leading-relaxed mt-2 max-w-xl">
                Una recopilación interactiva de mi trayectoria profesional y técnica estructurada a través de una experiencia digital única de exploración.
              </p>
            </div>

            <div className="mt-6 flex items-center text-xs text-zinc-400 group-hover:text-zinc-200 font-mono tracking-wider gap-1 transition-colors duration-300">
              <span>INICIAR EXPERIENCIA</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </a>

          {/* 5. PRINCIPIOS / FILOSOFÍA (Col 3, Row 3 en desktop) - PASIVA */}
          <div className="md:col-span-1 md:row-span-1 p-6 rounded-3xl border border-zinc-900 bg-zinc-900/5 flex flex-col justify-between min-h-[140px]">
            <h3 className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Enfoque</h3>
            <div className="my-2">
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Simplicidad conceptual y rigor estructural. Crear lo necesario, optimizar lo existente.
              </p>
            </div>
            <span className="text-[9px] text-zinc-600 font-mono">Filosofía de Trabajo</span>
          </div>

          {/* 6. CONTACTO (Col 4, Row 3 en desktop) - INTERACTIVA */}
          <div className="md:col-span-1 md:row-span-1 p-6 rounded-3xl border border-zinc-900 bg-zinc-900/5 flex flex-col justify-between min-h-[140px]">
            <h3 className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Contacto</h3>
            <div className="flex flex-col gap-1.5 my-2 text-xs font-mono text-zinc-400">
              <a href="mailto:jorge@doicela.com" className="hover:text-zinc-200 transition-colors duration-200 flex items-center gap-1">
                <span>Email</span>
                <span className="text-[10px] text-zinc-600">↗</span>
              </a>
              <a href="https://github.com/JorgeDoicela" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors duration-200 flex items-center gap-1">
                <span>GitHub</span>
                <span className="text-[10px] text-zinc-600">↗</span>
              </a>
            </div>
            <span className="text-[9px] text-zinc-600 font-mono">Redes Profesionales</span>
          </div>

        </div>
      </main>
      
    </div>
  );
}
