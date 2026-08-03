'use client';

import { useForum } from '../hooks/useForum';

export function ForumSection() {
  const { topics, loading, error } = useForum();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl glass-convex-panel animate-pulse flex items-center justify-between">
            <div className="space-y-2 w-2/3">
              <div className="h-5 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-800/60 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-16 bg-zinc-800 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 p-6 rounded-3xl glass-convex-panel text-red-400">
        <p>No se pudieron cargar los temas de foros: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida a los Foros */}
      <div className="p-6 md:p-8 rounded-3xl glass-convex-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h2 className="text-2xl font-bold tracking-tight text-white">Foros de la Comunidad Tecológica</h2>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            Espacio abierto para debates sobre desarrollo de software, arquitectura en la nube, Inteligencia Artificial y ciberseguridad.
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-indigo-600/20 whitespace-nowrap cursor-pointer">
          + Iniciar Discusión
        </button>
      </div>

      {/* Lista de Temas */}
      <div className="space-y-4">
        {topics.map((topic) => (
          <div 
            key={topic.id}
            className="group p-6 rounded-2xl glass-convex-panel transition-all duration-300 hover:border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-zinc-800 text-indigo-400 font-semibold border border-zinc-700">
                  {topic.category}
                </span>
                <span className="text-xs text-zinc-400">Publicado por {topic.author}</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                {topic.title}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {topic.content}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 self-end md:self-center shrink-0">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80">
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {topic.repliesCount} respuestas
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {topic.views}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
