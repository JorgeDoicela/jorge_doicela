'use client';

import React, { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Share2,
  Plus,
  X,
  Trash2,
  Eye,
} from 'lucide-react';
import { TerminalTab, ConnectionStatus } from '../types';
import { useTranslations } from 'next-intl';

interface TerminalHeaderProps {
  tabs: TerminalTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onAddTab: () => void;
  onCloseTab: (tabId: string) => void;
  connectionStatus: ConnectionStatus;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onCopyAll: () => void;
  onClear: () => void;
  onShareSession: () => void;
  isMirrorMode?: boolean;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onAddTab,
  onCloseTab,
  connectionStatus,
  isFullscreen,
  onToggleFullscreen,
  onCopyAll,
  onClear,
  onShareSession,
  isMirrorMode = false,
}) => {
  const t = useTranslations('Terminal');
  const [copiedAll, setCopiedAll] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  const handleCopy = () => {
    onCopyAll();
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleShare = () => {
    onShareSession();
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 3000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-border-gold text-xs select-none">
      {/* Controles de ventana y pestañas Tmux */}
      <div className="flex items-center gap-3 overflow-x-auto max-w-[70%] scrollbar-none">
        {/* Luces de ventana sutiles estilo Dark Luxury */}
        <div className="flex gap-1.5 shrink-0 pr-1 items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-gold-400/70 hover:opacity-100 transition-opacity inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-gold-500/40 hover:opacity-100 transition-opacity inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-foreground/20 hover:opacity-100 transition-opacity inline-block" />
        </div>

        {/* Pestañas tmux */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          {tabs.map((tab, idx) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md cursor-pointer transition-all duration-150 border ${
                  isActive
                    ? 'bg-surface-raised border-border-gold text-gold-200 font-medium shadow-sm'
                    : 'bg-transparent border-transparent text-muted hover:text-foreground/80 hover:bg-surface-raised/40'
                }`}
              >
                <span>
                  {idx}: {tab.title}
                </span>
                {tabs.length > 1 && !isMirrorMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="hover:text-gold-200 text-muted p-0.5 rounded transition-colors"
                    title={t('closeTab')}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {!isMirrorMode && tabs.length < 5 && (
            <button
              onClick={onAddTab}
              className="p-1 rounded-md text-muted hover:text-gold-300 hover:bg-surface-raised border border-transparent hover:border-border-gold transition-all"
              title={t('newTab')}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Indicador de estado y botones de acción */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Modo Espejo Tag si aplica */}
        {isMirrorMode && (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-raised text-gold-300 border border-border-gold text-[10px] font-mono animate-pulse">
            <Eye className="w-3 h-3" />
            <span>{t('mirrorMode')}</span>
          </span>
        )}

        {/* Botón Compartir Sesión */}
        {!isMirrorMode && (
          <button
            onClick={handleShare}
            className="p-1.5 rounded-md hover:bg-surface-raised border border-border-gold text-muted hover:text-gold-200 transition-colors relative"
            title={t('shareSession')}
          >
            <Share2 className="w-3.5 h-3.5" />
            {sharedToast && (
              <span className="absolute -top-7 right-0 bg-gold-400 text-black font-semibold text-[9px] font-mono px-2 py-0.5 rounded shadow-lg whitespace-nowrap animate-fade-in">
                {t('copySuccess')}
              </span>
            )}
          </button>
        )}

        {/* Botón Copiar Historial */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-surface-raised border border-border-gold text-muted hover:text-gold-200 transition-colors relative"
          title={t('copyAll')}
        >
          {copiedAll ? (
            <Check className="w-3.5 h-3.5 text-gold-200" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Botón Limpiar Pantalla */}
        <button
          onClick={onClear}
          className="p-1.5 rounded-md hover:bg-surface-raised border border-border-gold text-muted hover:text-gold-200 transition-colors"
          title={t('clearScreen')}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Botón Pantalla Completa */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-md hover:bg-surface-raised border border-border-gold text-muted hover:text-gold-200 transition-colors"
          title={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};

