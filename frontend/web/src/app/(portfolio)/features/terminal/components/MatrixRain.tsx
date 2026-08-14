'use client';

import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  onClose: () => void;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 450;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Caracteres Matrix: Katakana + Números + Letras
    const characters =
      'ｦｱｳｴｵｶｷｹｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ1234567890ABCDEF@#$%&*+-=<>~';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: columns }).fill(1) as number[];

    const draw = () => {
      // Fondo translúcido para dejar estela
      ctx.fillStyle = 'rgba(10, 10, 12, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(
          Math.floor(Math.random() * characters.length)
        );

        // Cabecera blanca / dorada brillante y cuerpo verde esmeralda
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#ffffff';
        } else if (Math.random() > 0.65) {
          ctx.fillStyle = '#e6c88b'; // Toque dorado
        } else {
          ctx.fillStyle = '#10b981'; // Verde esmeralda Matrix
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleKeyDown = () => {
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center cursor-pointer rounded-xl overflow-hidden backdrop-blur-sm"
      title="Haz clic o presiona cualquier tecla para salir de Matrix"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-40 bg-black/80 px-4 py-2 rounded-full border border-emerald-500/40 text-emerald-400 text-xs font-mono tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse">
        MODO MATRIX ACTIVO • HAZ CLIC O PRESIONA CUALQUIER TECLA PARA SALIR
      </div>
    </div>
  );
};
