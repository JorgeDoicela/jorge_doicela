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
            <head>
                <style>{`
                    @keyframes starsPulse {
                        0% { opacity: 0.3; transform: scale(0.97); }
                        100% { opacity: 0.6; transform: scale(1.03); }
                    }
                    .error-stars::before {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-image: 
                            radial-gradient(1px 1px at 30px 40px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 90px 180px, rgba(255,255,255,0.85), rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 220px 100px, #fff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 150px 300px, rgba(255,255,255,0.65), rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 280px 220px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 80px 290px, rgba(255,255,255,0.7), rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 310px 50px, #fff, rgba(0,0,0,0));
                        background-size: 300px 300px;
                        opacity: 0.45;
                        pointer-events: none;
                        animation: starsPulse 15s infinite alternate ease-in-out;
                    }
                `}</style>
            </head>
            <body
                className="error-stars min-h-screen flex flex-col items-center justify-center p-6 text-center antialiased relative overflow-hidden"
                style={{
                    backgroundColor: '#030303',
                    backgroundImage: [
                        'radial-gradient(circle at -10% -10%, rgba(168, 85, 247, 0.18) 0%, transparent 60%)',
                        'radial-gradient(circle at 110% 110%, rgba(99, 102, 241, 0.20) 0%, transparent 60%)',
                        'radial-gradient(circle at 15% 75%, rgba(56, 189, 248, 0.12) 0%, transparent 50%)',
                        'radial-gradient(circle at 90% 15%, rgba(236, 72, 153, 0.12) 0%, transparent 50%)',
                        'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.06) 0%, transparent 40%)',
                    ].join(', '),
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        maxWidth: '480px',
                        width: '100%',
                        backgroundColor: 'rgba(10, 10, 15, 0.48)',
                        border: '1px solid rgba(255, 255, 255, 0.055)',
                        padding: '56px 48px',
                        borderRadius: '24px',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.9), 0 0 50px rgba(99, 102, 241, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '32px',
                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.12)',
                        }}
                    >
                        <svg
                            style={{ width: '28px', height: '28px', color: '#f87171' }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    <h2
                        style={{
                            fontSize: '22px',
                            fontWeight: 400,
                            letterSpacing: '-0.02em',
                            margin: '0 0 16px 0',
                            color: '#ffffff',
                        }}
                    >
                        Interrupción Temporal del Servicio
                    </h2>

                    <p
                        style={{
                            fontSize: '14px',
                            color: '#d4d4d4',
                            lineHeight: 1.7,
                            margin: 0,
                            fontWeight: 300,
                        }}
                    >
                        Hemos detectado dificultades técnicas al inicializar la aplicación. Ya nos encontramos trabajando en la solución de cualquier inconveniente técnico para restablecer el servicio a la brevedad posible. Agradecemos tu paciencia y comprensión.
                    </p>
                </div>
            </body>
        </html>
    );
}
