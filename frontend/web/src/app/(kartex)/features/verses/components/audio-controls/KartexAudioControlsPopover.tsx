'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Clock,
  Gauge,
  Mic,
  Volume2,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { useKartexPassageSafe } from '../../../../entities/passage';
import { KartexSelect, type KartexSelectOption } from '../../../../shared/ui';

export interface KartexAudioControlsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  align?: 'left' | 'right';
  className?: string;
  isMobileModal?: boolean;
}

export const KartexAudioControlsPopover: React.FC<KartexAudioControlsPopoverProps> = ({
  isOpen,
  onClose,
  align = 'right',
  className = '',
  isMobileModal = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const passageContext = useKartexPassageSafe();

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Bloqueo de scroll en document.body cuando el Bottom Sheet está abierto en móvil
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen && (isMobile || isMobileModal)) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, isMobile, isMobileModal]);

  // Cerrar al pulsar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Gestos de arrastre táctil / puntero para cerrar el Bottom Sheet en móvil
  const handleDragStart = (clientY: number) => {
    dragStartYRef.current = clientY;
    setIsDragging(true);
  };

  const handleDragMove = (clientY: number) => {
    if (dragStartYRef.current === null) return;
    const deltaY = clientY - dragStartYRef.current;
    setDragOffsetY(deltaY > 0 ? deltaY : 0);
  };

  const handleDragEnd = () => {
    if (dragStartYRef.current !== null && dragOffsetY > 45) {
      onClose();
    }
    dragStartYRef.current = null;
    setIsDragging(false);
    setDragOffsetY(0);
  };

  const isPlayingAudio = passageContext?.isPlayingAudio ?? false;
  const isAudioPaused = passageContext?.isAudioPaused ?? false;
  const currentAudioVerse = passageContext?.currentAudioVerse ?? null;
  const audioSpeed = passageContext?.audioSpeed ?? 1.0;
  const sleepTimerMinutes = passageContext?.sleepTimerMinutes ?? null;
  const sleepTimerRemainingSeconds = passageContext?.sleepTimerRemainingSeconds ?? null;
  const availableVoices = passageContext?.availableVoices ?? [];
  const selectedVoiceURI = passageContext?.selectedVoiceURI ?? null;

  if (!isOpen || !passageContext) return null;

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0];
  const timerOptions: { label: string; value: number | null }[] = [
    { label: 'Off', value: null },
    { label: '15m', value: 15 },
    { label: '30m', value: 30 },
    { label: '45m', value: 45 },
    { label: 'Fin Cap.', value: -1 },
  ];

  const formatRemainingTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentBookName = passageContext.selectedBook?.name || '';
  const currentChapter = passageContext.selectedChapter || 1;

  const handlePlayPause = () => {
    if (!isPlayingAudio) {
      passageContext.toggleAudio();
    } else if (isAudioPaused) {
      passageContext.resumeAudio();
    } else {
      passageContext.pauseAudio();
    }
  };

  const handleStop = () => {
    passageContext.stopAudio();
  };

  // Opciones de voces del sistema con filtrado por idioma
  const targetLangPrefix = locale && locale.toLowerCase().startsWith('en') ? 'en' : 'es';
  const uniqueVoicesMap = new Map<string, SpeechSynthesisVoice>();
  for (const v of availableVoices) {
    const identifier = v.voiceURI || `${v.name}-${v.lang}`;
    if (!uniqueVoicesMap.has(identifier)) {
      uniqueVoicesMap.set(identifier, v);
    }
  }
  const allUnique = Array.from(uniqueVoicesMap.values());
  const languageFiltered = allUnique.filter((v) =>
    v.lang.toLowerCase().startsWith(targetLangPrefix)
  );
  const uniqueVoices = languageFiltered.length > 0 ? languageFiltered : allUnique;

  const voiceOptions: KartexSelectOption<string>[] = [
    { value: '', label: 'Automática (Recomendada)' },
    ...uniqueVoices.map((v) => ({
      value: v.voiceURI,
      label: v.name,
      badge: v.lang,
    })),
  ];

  // Contenido de los controles de audio (reutilizado tanto en Bottom Sheet como en Popover)
  const controlsContent = (
    <>
      {/* Barra de Transporte Principal */}
      <div className="py-2 flex items-center justify-center gap-3">
        {/* Versículo Anterior */}
        <button
          type="button"
          onClick={() => passageContext.playPrevVerse()}
          disabled={!isPlayingAudio}
          className="w-10 h-10 rounded-full flex items-center justify-center text-accents-5 hover:text-foreground hover:bg-accents-2 active:scale-90 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          title="Versículo anterior"
          aria-label="Versículo anterior"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Play / Pausa / Reanudar */}
        <button
          type="button"
          onClick={handlePlayPause}
          className="w-13 h-13 rounded-full bg-foreground text-background flex items-center justify-center active:scale-95 shadow-md transition-all cursor-pointer"
          title={
            !isPlayingAudio
              ? 'Iniciar lectura'
              : isAudioPaused
              ? 'Reanudar lectura'
              : 'Pausar lectura'
          }
          aria-label={
            !isPlayingAudio
              ? 'Iniciar lectura'
              : isAudioPaused
              ? 'Reanudar lectura'
              : 'Pausar lectura'
          }
        >
          {isPlayingAudio && !isAudioPaused ? (
            <Pause className="w-5 h-5 fill-current stroke-none" />
          ) : (
            <Play className="w-5 h-5 fill-current stroke-none ml-0.5" />
          )}
        </button>

        {/* Versículo Siguiente */}
        <button
          type="button"
          onClick={() => passageContext.playNextVerse()}
          disabled={!isPlayingAudio}
          className="w-10 h-10 rounded-full flex items-center justify-center text-accents-5 hover:text-foreground hover:bg-accents-2 active:scale-90 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          title="Versículo siguiente"
          aria-label="Versículo siguiente"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Detener */}
        <button
          type="button"
          onClick={handleStop}
          disabled={!isPlayingAudio}
          className="w-10 h-10 rounded-full flex items-center justify-center text-accents-5 hover:text-red-500 hover:bg-red-500/10 active:scale-90 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none ml-1"
          title="Detener lectura"
          aria-label="Detener lectura"
        >
          <Square className="w-3.5 h-3.5 fill-current stroke-none" />
        </button>
      </div>

      {/* Control de Velocidad */}
      <div className="pt-3 border-t border-border/60">
        <div className="flex items-center justify-between text-xs text-accents-5 mb-1.5">
          <span className="flex items-center gap-1.5 font-medium">
            <Gauge className="w-3.5 h-3.5 text-accents-4" />
            Velocidad
          </span>
          <span className="font-mono text-[11px] font-semibold text-foreground">
            {audioSpeed}x
          </span>
        </div>
        <div className="flex items-center p-0.5 rounded-full border border-border/80 bg-accents-1 gap-0.5">
          {speedOptions.map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => passageContext.setAudioSpeed(speed)}
              className={`flex-1 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer text-center ${
                audioSpeed === speed
                  ? 'bg-foreground text-background font-bold shadow-2xs'
                  : 'text-accents-5 hover:text-foreground hover:bg-accents-2'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Temporizador de Apagado (Sleep Timer) */}
      <div className="pt-3 border-t border-border/60">
        <div className="flex items-center justify-between text-xs text-accents-5 mb-1.5">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-accents-4" />
            Temporizador
          </span>
          {sleepTimerRemainingSeconds !== null && (
            <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
              {formatRemainingTime(sleepTimerRemainingSeconds)}
            </span>
          )}
        </div>
        <div className="flex items-center p-0.5 rounded-full border border-border/80 bg-accents-1 gap-0.5">
          {timerOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => passageContext.setSleepTimer(opt.value)}
              className={`flex-1 py-1 px-1 rounded-full text-[10px] font-mono transition-all cursor-pointer text-center truncate ${
                sleepTimerMinutes === opt.value
                  ? 'bg-foreground text-background font-bold shadow-2xs'
                  : 'text-accents-5 hover:text-foreground hover:bg-accents-2'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Voces del Sistema */}
      {availableVoices.length > 0 && (
        <div className="pt-3 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-xs text-accents-5 mb-1.5 font-medium">
            <Mic className="w-3.5 h-3.5 text-accents-4" />
            Voz del Sistema
          </div>
          <KartexSelect
            value={selectedVoiceURI || ''}
            onChange={(val) => passageContext.setSelectedVoiceURI(val ? String(val) : null)}
            options={voiceOptions}
            size="sm"
            align="left"
            className="w-full text-xs"
            menuClassName="max-h-52 z-60"
          />
        </div>
      )}
    </>
  );

  // Renderizado en Móvil: Bottom Sheet modal montado vía Portal en document.body
  if ((isMobile || isMobileModal) && mounted && typeof document !== 'undefined') {
    return createPortal(
      <>
        {/* Backdrop Oscuro con Desenfoque */}
        <div
          onClick={onClose}
          onPointerDown={onClose}
          aria-hidden="true"
          data-kartex-audio-modal="backdrop"
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-in fade-in duration-200"
        />

        {/* Modal Deslizable desde Abajo (Bottom Sheet) */}
        <div
          role="dialog"
          data-kartex-audio-modal="content"
          aria-label="Panel de control de audio bíblico"
          style={{
            transform: dragOffsetY > 0 ? `translateY(${dragOffsetY}px)` : undefined,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="fixed inset-x-0 bottom-0 z-50 w-full max-h-[85vh] flex flex-col rounded-t-3xl border-t border-border bg-background dark:bg-card-bg shadow-[0_-12px_48px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-300 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] overflow-hidden select-none"
        >
          {/* Manija táctil superior (Tocar o deslizar hacia abajo para cerrar) */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Cerrar panel de audio"
            onClick={onClose}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              handleDragStart(e.clientY);
            }}
            onPointerMove={(e) => {
              if (isDragging) handleDragMove(e.clientY);
            }}
            onPointerUp={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
              }
              handleDragEnd();
            }}
            onPointerCancel={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
            onTouchEnd={handleDragEnd}
            className="w-full pt-3.5 pb-2 flex justify-center items-center cursor-pointer select-none touch-none shrink-0 group active:opacity-60"
          >
            <div className="w-12 h-1.5 rounded-full bg-border hover:bg-accents-4 transition-colors" />
          </div>

          {/* Cabecera del Bottom Sheet */}
          <div
            onPointerDown={(e) => handleDragStart(e.clientY)}
            onPointerMove={(e) => {
              if (isDragging) handleDragMove(e.clientY);
            }}
            onPointerUp={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
            onTouchEnd={handleDragEnd}
            className="flex items-center justify-between px-5 py-2.5 border-b border-border/60 shrink-0 select-none cursor-grab active:cursor-grabbing touch-none"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-full bg-foreground/5 flex items-center justify-center text-foreground shrink-0">
                <Volume2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">
                  {currentBookName} {currentChapter}
                </div>
                <div className="text-[10px] text-accents-5 font-mono">
                  {isPlayingAudio
                    ? currentAudioVerse
                      ? `Versículo ${currentAudioVerse}`
                      : 'Sincronizando...'
                    : 'Audio no iniciado'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                  isPlayingAudio && !isAudioPaused
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : isAudioPaused
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-accents-2 text-accents-5'
                }`}
              >
                {isPlayingAudio && !isAudioPaused
                  ? 'En vivo'
                  : isAudioPaused
                  ? 'En pausa'
                  : 'Detenido'}
              </span>
            </div>
          </div>

          {/* Contenido scrolleable interno */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4 kartex-scrollbar-slim">
            {controlsContent}
          </div>
        </div>
      </>,
      document.body
    );
  }

  // Renderizado en Escritorio / Tablet (Popover clásico flotante bajo el botón de la cabecera)
  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Panel de control de audio bíblico"
      className={`absolute top-full mt-2 ${
        align === 'right' ? 'right-0' : 'left-0'
      } w-80 max-w-[calc(100vw-2rem)] bg-background dark:bg-card-bg border border-border rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 select-none transition-all duration-150 ${className}`}
    >
      {/* Cabecera del Panel Desktop */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-foreground/5 flex items-center justify-center text-foreground shrink-0">
            <Volume2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">
              {currentBookName} {currentChapter}
            </div>
            <div className="text-[10px] text-accents-5 font-mono">
              {isPlayingAudio
                ? currentAudioVerse
                  ? `Versículo ${currentAudioVerse}`
                  : 'Sincronizando...'
                : 'Audio no iniciado'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
              isPlayingAudio && !isAudioPaused
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : isAudioPaused
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                : 'bg-accents-2 text-accents-5'
            }`}
          >
            {isPlayingAudio && !isAudioPaused
              ? 'En vivo'
              : isAudioPaused
              ? 'En pausa'
              : 'Detenido'}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        {controlsContent}
      </div>
    </div>
  );
};


