'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useTerminalSocket } from '../hooks/useTerminalSocket';
import { TerminalHeader } from './TerminalHeader';
import { MatrixRain } from './MatrixRain';
import { MobileTerminalBanner } from './MobileTerminalBanner';
import { parseAnsiToReact, stripAnsi } from '../utils/ansiParser';
import { Copy, Check, Terminal as TerminalIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SandboxTerminal } from './SandboxTerminal';
import { TerminalPane } from '../types';

export const TerminalConsole: React.FC = () => {
  const t = useTranslations('Terminal');
  const [terminalMode, setTerminalMode] = useState<'simulated' | 'vps' | 'tunnel'>('simulated');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    addTab,
    closeTab,
    splitPane,
    closePane,
    toggleSplit,
    setActivePaneId,
    sendCommand,
    requestTabComplete,
    navigateHistory,
    completions,
    setCompletions,
    connectionStatus,
    isMatrixActive,
    setIsMatrixActive,
    notifyResize,
  } = useTerminalSocket();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(true);
  const [copiedItemIndex, setCopiedItemIndex] = useState<string | null>(null);

  const terminalBoxRef = useRef<HTMLDivElement>(null);

  // Manejo de scroll del body y tecla Escape en pantalla completa
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsFullscreen(false);
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isFullscreen]);

  // Observador de redimensionado de terminal (PTY resize)
  useEffect(() => {
    if (!terminalBoxRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        const cols = Math.max(40, Math.floor(width / 8.5));
        const rows = Math.max(10, Math.floor(height / 20));
        notifyResize(cols, rows);
      }
    });

    observer.observe(terminalBoxRef.current);
    return () => observer.disconnect();
  }, [notifyResize]);

  // Copiar todo el buffer de la pestaña activa
  const handleCopyAll = () => {
    const allText = activeTab.panes
      .flatMap((pane) =>
        pane.history.map((item) =>
          item.type === 'command'
            ? `${item.prompt || `jorge@debian:${pane.cwd}$ `} ${item.content}`
            : stripAnsi(item.content)
        )
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

  // Atajos globales de tmux: Ctrl+B % (split v), Ctrl+B " (split h), Ctrl+B c (nueva pestaña), Ctrl+B 0..4
  useEffect(() => {
    let ctrlBPressed = false;
    let timer: NodeJS.Timeout | null = null;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (terminalMode !== 'simulated') return;

      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        ctrlBPressed = true;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          ctrlBPressed = false;
        }, 1500);
        return;
      }

      if (ctrlBPressed) {
        if (e.key === '%' || e.key === '5') {
          e.preventDefault();
          splitPane('vertical');
          ctrlBPressed = false;
        } else if (e.key === '"' || e.key === '2') {
          e.preventDefault();
          splitPane('horizontal');
          ctrlBPressed = false;
        } else if (e.key === 'c') {
          e.preventDefault();
          addTab();
          ctrlBPressed = false;
        } else if (['0', '1', '2', '3', '4'].includes(e.key)) {
          const targetTab = tabs[parseInt(e.key, 10)];
          if (targetTab) {
            e.preventDefault();
            setActiveTabId(targetTab.id);
          }
          ctrlBPressed = false;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, [terminalMode, splitPane, addTab, tabs, setActiveTabId]);

  // Contenido de la consola interactiva
  const terminalContent = (
    <div
      ref={terminalBoxRef}
      className={`w-full font-mono text-sm relative transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen rounded-none bg-background p-6 md:p-10 flex flex-col overflow-hidden'
          : 'w-full max-w-7xl mx-auto rounded-xl bg-surface/95 border border-border-gold/60 p-5 md:p-6 overflow-hidden'
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
        isSplit={activeTab.panes.length > 1}
        onToggleSplit={toggleSplit}
      />

      {/* Área de Paneles (Layout Single o Split en 2 columnas/filas) */}
      <div
        className={`w-full ${
          isFullscreen ? 'flex-1 min-h-0' : ''
        } ${
          activeTab.layout === 'split-vertical'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-3 h-full'
            : activeTab.layout === 'split-horizontal'
            ? 'grid grid-cols-1 grid-rows-2 gap-3 h-full'
            : 'flex flex-col h-full'
        }`}
      >
        {activeTab.panes.map((pane, idx) => (
          <SinglePane
            key={pane.id}
            pane={pane}
            paneIndex={idx}
            isSplit={activeTab.panes.length > 1}
            isActive={pane.id === activeTab.activePaneId}
            isFullscreen={isFullscreen}
            completions={pane.id === activeTab.activePaneId ? completions : []}
            onSelectCompletion={(comp) => {
              setCompletions([]);
            }}
            onFocus={() => setActivePaneId(pane.id)}
            onClose={() => closePane(pane.id)}
            onSendCommand={(cmd) => sendCommand(cmd, pane.id)}
            onRequestTabComplete={requestTabComplete}
            onNavigateHistory={(dir, curr) => navigateHistory(dir, curr, pane.id)}
            onCopyBlock={handleCopyBlock}
            copiedItemIndex={copiedItemIndex}
            t={t}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full relative flex flex-col gap-3">
      {/* Selector de Modo de Terminal (Simulada vs Sandbox VPS vs Sandbox Servidor Casero) */}
      {!isFullscreen && (
        <div className="flex items-center gap-2 px-1">
          <div className="inline-flex p-1 rounded-lg bg-surface-raised/80 border border-border-gold/60 backdrop-blur-md">
            {/* 1. Modo Simulado / Guiado */}
            <button
              onClick={() => setTerminalMode('simulated')}
              className={`flex items-center px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                terminalMode === 'simulated'
                  ? 'bg-surface border border-border-gold text-gold-200 shadow-sm'
                  : 'text-muted hover:text-foreground hover:bg-white/[0.04]'
              }`}
            >
              <span>{t('modeSimulated')}</span>
            </button>

            {/* 2. Modo Sandbox VPS (AWS) */}
            <button
              onClick={() => setTerminalMode('vps')}
              className={`flex items-center px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                terminalMode === 'vps'
                  ? 'bg-gold-400 text-black font-semibold shadow-sm'
                  : 'text-muted hover:text-gold-200 hover:bg-white/[0.04]'
              }`}
            >
              <span>{t('modeVps')}</span>
            </button>

            {/* 3. Modo Sandbox Servidor Casero (Túnel) */}
            <button
              onClick={() => setTerminalMode('tunnel')}
              className={`flex items-center px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                terminalMode === 'tunnel'
                  ? 'bg-gold-400 text-black font-semibold shadow-sm'
                  : 'text-muted hover:text-gold-200 hover:bg-white/[0.04]'
              }`}
            >
              <span>{t('modeTunnel')}</span>
            </button>
          </div>
        </div>
      )}

      {terminalMode === 'vps' || terminalMode === 'tunnel' ? (
        <SandboxTerminal isFullscreen={isFullscreen} targetMode={terminalMode} />
      ) : (
        <>
          {/* Banner informativo para dispositivos móviles */}
          {!isFullscreen && (
            <MobileTerminalBanner
              isMobileExpanded={isMobileExpanded}
              onToggleMobileExpand={() => setIsMobileExpanded(!isMobileExpanded)}
            />
          )}

          {/* Contenedor principal de la Terminal (con portal cuando está en pantalla completa) */}
          {isMobileExpanded && (
            isFullscreen && isMounted
              ? createPortal(terminalContent, document.body)
              : terminalContent
          )}
        </>
      )}
    </div>
  );
};

interface SinglePaneProps {
  pane: TerminalPane;
  paneIndex: number;
  isSplit: boolean;
  isActive: boolean;
  isFullscreen: boolean;
  completions: string[];
  onSelectCompletion: (comp: string) => void;
  onFocus: () => void;
  onClose: () => void;
  onSendCommand: (cmd: string) => void;
  onRequestTabComplete: (input: string) => void;
  onNavigateHistory: (dir: 'up' | 'down', curr: string) => string;
  onCopyBlock: (content: string, id: string) => void;
  copiedItemIndex: string | null;
  t: (key: string) => string;
}

const SinglePane: React.FC<SinglePaneProps> = ({
  pane,
  paneIndex,
  isSplit,
  isActive,
  isFullscreen,
  completions,
  onSelectCompletion,
  onFocus,
  onClose,
  onSendCommand,
  onRequestTabComplete,
  onNavigateHistory,
  onCopyBlock,
  copiedItemIndex,
  t,
}) => {
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  // Auto-scroll al final cuando llega nuevo contenido a este panel
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [pane.history, completions]);

  // Enfocar input solo tras interacción del usuario (evita scroll automático en carga inicial)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isActive) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [isActive]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!input.trim()) return;

      if (completions.length === 1) {
        const parts = input.split(/\s+/);
        if (parts.length <= 1) {
          setInput(completions[0] + ' ');
        } else {
          parts[parts.length - 1] = completions[0];
          setInput(parts.join(' ') + ' ');
        }
      } else {
        onRequestTabComplete(input);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const previousCommand = onNavigateHistory('up', input);
      setInput(previousCommand);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextCommand = onNavigateHistory('down', input);
      setInput(nextCommand);
      return;
    }

    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      onSendCommand('clear');
      return;
    }

    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setInput('');
      return;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendCommand(input);
    setInput('');
  };

  const handlePaneClick = () => {
    onFocus();
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div
      onClick={handlePaneClick}
      className={`flex flex-col rounded-lg transition-all duration-200 cursor-text ${
        isFullscreen ? 'flex-1 min-h-0 h-full' : ''
      } ${
        isSplit
          ? `p-3 bg-surface-raised/40 border ${
              isActive
                ? 'border-border-gold shadow-sm'
                : 'border-border/30 opacity-80 hover:opacity-100'
            }`
          : ''
      }`}
    >
      {/* Cabecera del panel en modo split */}
      {isSplit && (
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-border/30 text-[10px] font-mono select-none shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-gold-400' : 'bg-foreground/20'
              }`}
            />
            <span className={isActive ? 'text-gold-300 font-semibold' : 'text-muted'}>
              Consola {paneIndex + 1} • {pane.cwd || '~'}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-muted hover:text-gold-200 p-0.5 rounded transition-colors"
            title="Cerrar panel (exit)"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Historial con scroll */}
      <div
        ref={containerRef}
        onClick={handlePaneClick}
        className={`overflow-y-auto pr-1 space-y-2 select-text whitespace-pre-wrap leading-relaxed text-foreground/85 font-mono text-xs scrollbar-thin scrollbar-thumb-border-gold hover:scrollbar-thumb-gold-500/40 ${
          isFullscreen
            ? 'flex-1 min-h-0'
            : isSplit
            ? 'min-h-[220px] max-h-[380px]'
            : 'min-h-[220px] max-h-[460px]'
        }`}
      >
        {pane.history.map((item) => {
          if (item.type === 'command') {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between group text-foreground font-medium tracking-wide py-0.5"
              >
                <div>
                  <span className="text-gold-300 font-semibold mr-2">
                    {item.prompt || `jorge@debian:${pane.cwd || '~'}$`}
                  </span>
                  <span>{item.content}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyBlock(item.content, item.id);
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
                  onCopyBlock(item.content, item.id);
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

        {/* Sugerencias de autocompletado */}
        {completions.length > 0 && isActive && (
          <div className="p-2.5 my-2 rounded-lg bg-surface-raised border border-gold-400/30 text-xs animate-fade-in">
            <div className="text-gold-300 font-semibold mb-1.5 flex items-center gap-1.5 text-[11px]">
              <TerminalIcon className="w-3 h-3" />
              <span>{t('suggestions')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {completions.map((comp, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    const parts = input.split(/\s+/);
                    if (parts.length <= 1) {
                      setInput(comp + ' ');
                    } else {
                      parts[parts.length - 1] = comp;
                      setInput(parts.join(' ') + ' ');
                    }
                    inputRef.current?.focus({ preventScroll: true });
                  }}
                  className="px-2 py-0.5 rounded bg-background/80 hover:bg-gold-400/20 text-foreground/90 hover:text-gold-200 border border-border/50 text-[10px] transition-colors cursor-pointer"
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input interactivo */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center mt-2.5 border-t border-border/40 pt-2.5 shrink-0"
      >
        <span className="text-gold-300 font-semibold select-none mr-2 text-xs md:text-sm shrink-0">
          jorge@debian:{pane.cwd || '~'}$
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
    </div>
  );
};

