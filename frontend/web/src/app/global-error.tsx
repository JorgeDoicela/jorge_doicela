'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Registrar error en consola para diagnóstico
        console.error('[GlobalError]:', error);

        // Si es un error de recarga de chunks por despliegue reciente, intentar auto-recarga limpia
        if (
            error?.message?.includes('ChunkLoadError') ||
            error?.message?.includes('Loading chunk')
        ) {
            window.location.reload();
        }
    }, [error]);

    return (
        <html lang="es">
            <body className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-6 font-sans">
                <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl text-center space-y-6">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">
                        !
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-medium tracking-tight text-zinc-100">
                            Interrupción Temporal
                        </h2>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                            Ocurrió un error inesperado al cargar la aplicación.
                        </p>
                    </div>
                    <button
                        onClick={() => reset()}
                        className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-zinc-200 transition-colors cursor-pointer"
                    >
                        Reintentar
                    </button>
                </div>
            </body>
        </html>
    );
}
