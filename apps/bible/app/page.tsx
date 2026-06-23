import { VerseList } from './features/verses/components/VerseList';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-16 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
          Biblia Modular App
        </h1>
        <p className="text-slate-400 max-w-md mx-auto text-lg">
          Un módulo de lectura y consulta de versículos con bases de datos aisladas e indexación rápida.
        </p>
      </header>

      <main className="w-full max-w-5xl">
        <VerseList />
      </main>

      <footer className="mt-20 text-slate-500 text-sm">
        Jorge Doicela &copy; {new Date().getFullYear()} — Arquitectura en Capas Decoplada
      </footer>
    </div>
  );
}
