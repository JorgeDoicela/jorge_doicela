import { ProjectGrid } from './features/projects/components/ProjectGrid';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-16 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mb-4">
          Software Projects Hub
        </h1>
        <p className="text-slate-400 max-w-md mx-auto text-lg">
          Galería de herramientas, sistemas y utilidades de software construidos con arquitectura limpia y modular.
        </p>
      </header>

      <main className="w-full max-w-6xl">
        <ProjectGrid />
      </main>

      <footer className="mt-20 text-slate-500 text-sm">
        Jorge Doicela &copy; {new Date().getFullYear()} — Base de Datos SQLite Aislada
      </footer>
    </div>
  );
}
