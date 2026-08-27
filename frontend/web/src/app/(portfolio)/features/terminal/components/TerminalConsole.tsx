'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTerminalSocket } from '../hooks/useTerminalSocket';
import { TerminalHeader } from './TerminalHeader';
import { MatrixRain } from './MatrixRain';
import { MobileTerminalBanner } from './MobileTerminalBanner';
import { parseAnsiToReact, stripAnsi } from '../utils/ansiParser';
import { Copy, Check, Terminal as TerminalIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const TerminalConsole: React.FC = () => {
  const t = useTranslations('Terminal');
  const {

    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    addTab,
    closeTab,
    sendCommand,
    requestTabComplete,
    navigateHistory,
    completions,
    setCompletions,
    connectionStatus,
    isMatrixActive,
    setIsMatrixActive,
    isMirrorMode,
    shareSession,
    notifyResize,
  } = useTerminalSocket();

  const [input, setInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(true);
  const [copiedItemIndex, setCopiedItemIndex] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBoxRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando llega nuevo contenido
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [activeTab.history, completions]);

  // Observador de redimensionado de terminal (PTY resize)
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        const cols = Math.max(40, Math.floor(width / 8.5));
        const rows = Math.max(10, Math.floor(height / 20));
        notifyResize(cols, rows);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [notifyResize]);

  // Manejador de teclado para Tab, Flecha Arriba/Abajo, Ctrl+L
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Autocompletado con Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!input.trim()) return;

      // Si ya hay sugerencias y el usuario presiona Tab
      if (completions.length === 1) {
        const parts = input.split(/\s+/);
        if (parts.length <= 1) {
          setInput(completions[0] + ' ');
        } else {
          parts[parts.length - 1] = completions[0];
          setInput(parts.join(' ') + ' ');
        }
        setCompletions([]);
      } else {
        requestTabComplete(input);
      }
      return;
    }

    // Navegación por historial con Flecha Arriba
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const previousCommand = navigateHistory('up', input);
      setInput(previousCommand);
      return;
    }

    // Navegación por historial con Flecha Abajo
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextCommand = navigateHistory('down', input);
      setInput(nextCommand);
      return;
    }

    // Atajo Ctrl+L para limpiar pantalla
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      sendCommand('clear');
      return;
    }

    // Atajo Ctrl+C para cancelar entrada
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setInput('');
      setCompletions([]);
      return;
    }

    // Si escribe cualquier otra tecla, limpiar sugerencias previas
    if (completions.length > 0 && e.key !== 'Shift' && e.key !== 'Control') {
      setCompletions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendCommand(input);
    setInput('');
    setCompletions([]);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Copiar todo el buffer de la pestaña activa
  const handleCopyAll = () => {
    const allText = activeTab.history
      .map((item) =>
        item.type === 'command'
          ? `${item.prompt || 'jorge@vps-1gb-ram:~$ '} ${item.content}`
          : stripAnsi(item.content)
      )
      .join('\n');
    navigator.clipboard.writeText(allText);
  };

  // Copiar un bloque individual
  const handleCopyBlock = (content: string, id: string) => {
    const plainText = stripAnsi(content);
    navigator.clipboard.writeText(plainText);
    setCopiedItemIndex(id);
    setTimeout(() => setCopiedItemIndex(null), 2000);
  };

  // Limpiar pestaña activa
  const handleClear = () => {
    sendCommand('clear');
  };

  // Seleccionar sugerencia de autocompletado
  const handleSelectCompletion = (completion: string) => {
    const parts = input.split(/\s+/);
    if (parts.length <= 1) {
      setInput(completion + ' ');
    } else {
      parts[parts.length - 1] = completion;
      setInput(parts.join(' ') + ' ');
    }
    setCompletions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full relative">
      {/* Banner informativo para dispositivos móviles */}
      <MobileTerminalBanner
        isMobileExpanded={isMobileExpanded}
        onToggleMobileExpand={() => setIsMobileExpanded(!isMobileExpanded)}
      />

      {/* Contenedor principal de la Terminal */}
      {isMobileExpanded && (
        <div
          ref={terminalBoxRef}
          onClick={focusInput}
          className={`w-full font-mono text-sm cursor-text relative overflow-hidden transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 z-50 rounded-none bg-surface/98 border-none p-6 md:p-10 flex flex-col backdrop-blur-xl shadow-2xl'
              : 'w-full max-w-7xl mx-auto rounded-xl bg-surface/95 border border-border-gold shadow-2xl p-5 md:p-6 luxury-glow-hover'
          }`}
        >
          {/* Capa de animación Matrix cuando está activa */}
          {isMatrixActive && (
            <MatrixRain onClose={() => setIsMatrixActive(false)} />
          )}

          {/* Cabecera con pestañas tmux y acciones */}
          <TerminalHeader
            tabs={tabs}
            activeTabId={activeTabId}
            onSelectTab={setActiveTabId}
            onAddTab={addTab}
            onCloseTab={closeTab}
            connectionStatus={connectionStatus}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            onCopyAll={handleCopyAll}
            onClear={handleClear}
            onShareSession={shareSession}
            isMirrorMode={isMirrorMode}
          />

          {/* Área de salida con scroll */}
          <div
            ref={containerRef}
            className={`overflow-y-auto pr-2 space-y-2 select-text whitespace-pre-wrap leading-relaxed text-foreground/85 font-mono text-xs md:text-sm scrollbar-thin scrollbar-thumb-border-gold hover:scrollbar-thumb-gold-500/40 ${
              isFullscreen ? 'flex-1 min-h-[500px]' : 'h-[380px] md:h-[420px]'
            }`}
          >
            {activeTab.history.map((item) => {
              if (item.type === 'command') {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between group text-foreground font-medium tracking-wide py-0.5"
                  >
                    <div>
                      <span className="text-gold-300 font-semibold mr-2">
                        {item.prompt || `jorge@vps-1gb-ram:${item.cwd || '~'}$`}
                      </span>
                      <span>{item.content}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyBlock(item.content, item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-foreground/40 hover:text-gold-300 rounded transition-opacity"
                      title={t('copyCmd')}
                    >
                      {copiedItemIndex === item.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="group relative hover:bg-white/[0.02] rounded px-1 -mx-1 py-0.5 transition-colors"
                >
                  <div className="text-foreground/85">
                    {parseAnsiToReact(item.content)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyBlock(item.content, item.id);
                    }}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-foreground/40 hover:text-gold-300 bg-surface/80 rounded transition-opacity"
                    title={t('copyOutput')}
                  >
                    {copiedItemIndex === item.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              );
            })}

            {/* Sugerencias de autocompletado Tab */}
            {completions.length > 0 && (
              <div className="p-3 my-2 rounded-lg bg-surface-raised border border-gold-400/30 text-xs animate-fade-in">
                <div className="text-gold-300 font-semibold mb-1.5 flex items-center gap-1.5">
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>{t('suggestions')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {completions.map((comp, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCompletion(comp);
                      }}
                      className="px-2 py-1 rounded bg-background/80 hover:bg-gold-400/20 text-foreground/90 hover:text-gold-200 border border-border/50 text-[11px] transition-colors cursor-pointer"
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fila de entrada interactiva */}
          {!isMirrorMode ? (
            <form
              onSubmit={handleSubmit}
              className="flex items-center mt-3 border-t border-border/40 pt-3"
            >
              <span className="text-gold-300 font-semibold select-none mr-2 text-xs md:text-sm shrink-0">
                jorge@vps-1gb-ram:{activeTab.cwd}$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-foreground border-none outline-none focus:ring-0 p-0 font-mono placeholder-foreground/30 text-xs md:text-sm"
                placeholder={t('placeholder')}
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          ) : (
            <div className="mt-3 border-t border-border/40 pt-3 text-xs text-sky-300 font-mono flex items-center justify-between">
              <span>{t('mirrorModeNotice')}</span>
              <span className="text-[10px] text-muted uppercase">{t('spectator')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

