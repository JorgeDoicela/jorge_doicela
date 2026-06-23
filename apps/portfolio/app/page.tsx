import { TerminalConsole } from './features/terminal/components/TerminalConsole';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center py-16 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 mb-4">
          Jorge Doicela
        </h1>
        <p className="text-slate-400 max-w-md mx-auto text-lg">
          Desarrollador de Software. Conéctate a mi VPS interactivo para explorar mi experiencia y proyectos.
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <TerminalConsole />
      </main>

      <footer className="mt-20 text-slate-500 text-sm">
        Jorge Doicela &copy; {new Date().getFullYear()} — WebSocket ssh simulation
      </footer>
    </div>
  );
}
