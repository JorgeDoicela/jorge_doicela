import React from 'react';

/**
 * Mapeo de códigos ANSI a la paleta Dark Luxury del Portafolio
 */
const ANSI_COLOR_MAP: Record<string, string> = {
  // Reset
  '0': '',
  // Modificadores
  '1': 'font-semibold text-gold-100',
  '2': 'opacity-70',
  '4': 'underline underline-offset-2 decoration-gold-400/50',
  // Foreground Estándar — Armonizado con Dark Luxury
  '30': 'text-muted',                            // Black / Muted
  '31': 'text-red-400',                          // Red
  '32': 'text-emerald-400/90',                  // Green / Success
  '33': 'text-gold-300',                         // Gold Primario
  '34': 'text-gold-200',                         // Gold Claro
  '35': 'text-gold-400',                         // Gold Profundo
  '36': 'text-gold-100',                         // Gold Luminoso
  '37': 'text-foreground/90',                    // Blanco / Cream
  // Bright Foreground
  '90': 'text-muted',                            // Muted Gray
  '91': 'text-red-300',                          // Light Red
  '92': 'text-emerald-300',                      // Light Green
  '93': 'text-gold-100 font-medium',             // Bright Gold
  '94': 'text-gold-200',                         // Bright Gold 2
  '95': 'text-gold-300',                         // Bright Gold 3
  '96': 'text-gold-100',                         // Bright Gold 1
  '97': 'text-foreground font-medium',           // Bright Cream
  // Backgrounds
  '40': 'bg-surface-raised border border-border-gold text-foreground px-1.5 py-0.5 rounded text-xs',
  '41': 'bg-red-950/60 border border-red-900/40 text-red-200 px-1.5 py-0.5 rounded text-xs',
  '42': 'bg-emerald-950/60 border border-emerald-900/40 text-emerald-200 px-1.5 py-0.5 rounded text-xs',
  '43': 'bg-surface-raised border border-border-gold text-gold-200 px-1.5 py-0.5 rounded text-xs',
  '44': 'bg-surface-raised border border-border-gold text-gold-300 px-1.5 py-0.5 rounded text-xs',
  '45': 'bg-surface-raised border border-border-gold text-gold-400 px-1.5 py-0.5 rounded text-xs',
  '46': 'bg-surface-raised border border-border-gold text-gold-100 px-1.5 py-0.5 rounded text-xs',
  '47': 'bg-gold-200 text-black px-1.5 py-0.5 rounded text-xs',
};

// Regex para secuencias ANSI: \u001b[...m
// eslint-disable-next-line no-control-regex
const ANSI_REGEX = /(?:\x1b|\u001b)\[([0-9;]*)m/g;

/**
 * Elimina las secuencias de escape ANSI para obtener texto plano
 */
export function stripAnsi(text: string): string {
  if (!text) return '';
  // eslint-disable-next-line no-control-regex
  return text.replace(/(?:\x1b|\u001b)\[[0-9;]*m/g, '');
}

/**
 * Convierte un string con secuencias ANSI a elementos React estilizados bajo el sistema Dark Luxury
 */
export function parseAnsiToReact(text: string): React.ReactNode {
  if (!text) return null;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  const currentClasses: Set<string> = new Set();
  let match: RegExpExecArray | null;

  let segmentKey = 0;
  const regex = new RegExp(ANSI_REGEX.source, 'g');

  while ((match = regex.exec(text)) !== null) {
    const textSegment = text.slice(lastIndex, match.index);
    if (textSegment) {
      elements.push(
        <span
          key={`ansi-seg-${segmentKey++}`}
          className={Array.from(currentClasses).join(' ')}
        >
          {textSegment}
        </span>
      );
    }

    const codes = match[1] ? match[1].split(';') : ['0'];
    for (const code of codes) {
      if (code === '0' || code === '') {
        currentClasses.clear();
      } else if (ANSI_COLOR_MAP[code]) {
        // Si es color de texto (30-37, 90-97), limpiar clases de texto anteriores
        if (
          (parseInt(code, 10) >= 30 && parseInt(code, 10) <= 37) ||
          (parseInt(code, 10) >= 90 && parseInt(code, 10) <= 97)
        ) {
          const toRemove = Array.from(currentClasses).filter((c) =>
            c.startsWith('text-')
          );
          for (const item of toRemove) {
            currentClasses.delete(item);
          }
        }
        // Si es background (40-47), limpiar clases de fondo anteriores
        if (parseInt(code, 10) >= 40 && parseInt(code, 10) <= 47) {
          const toRemove = Array.from(currentClasses).filter((c) =>
            c.startsWith('bg-')
          );
          for (const item of toRemove) {
            currentClasses.delete(item);
          }
        }
        currentClasses.add(ANSI_COLOR_MAP[code]);
      }
    }

    lastIndex = regex.lastIndex;
  }

  // Texto restante después de la última secuencia
  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    elements.push(
      <span
        key={`ansi-seg-${segmentKey++}`}
        className={Array.from(currentClasses).join(' ')}
      >
        {remainingText}
      </span>
    );
  }

  return <>{elements}</>;
}
