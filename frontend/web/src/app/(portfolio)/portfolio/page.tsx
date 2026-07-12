import { TerminalConsole } from '../features/terminal/components/TerminalConsole';
import { ThemeToggle } from '../components/ThemeToggle';

export default function PortfolioPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center py-16 px-4 relative overflow-hidden" style={{ background: 'radial-gradient(circle at center, rgba(197,168,128,0.07) 0%, transparent 60%), var(--background)' }}>

            {/* Header con ThemeToggle */}
            <div className="fixed top-0 right-0 z-50 p-4">
                <ThemeToggle />
            </div>

            <header className="mb-12 text-center max-w-xl">
                <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.25em] uppercase text-foreground mb-4 select-none">
                    Jorge Doicela
                </h1>
                <p className="text-gold-s/70 max-w-md mx-auto text-xs sm:text-sm tracking-widest uppercase font-light">
                    Desarrollador de Software. Explora mi trayectoria profesional a través de la consola interactiva.
                </p>
            </header>

            <main className="w-full max-w-4xl z-10">
                <TerminalConsole />
            </main>

            <footer className="mt-20 text-gold-s/40 text-[10px] tracking-[0.2em] uppercase font-mono">
                Jorge Doicela &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
}

