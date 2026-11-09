'use client';

import { useEffect } from 'react';
import { ReaderFontSize } from '../types';
import {
  MIN_READER_FONT_SIZE,
  MAX_READER_FONT_SIZE,
  normalizeFontSizeToPx,
} from '../config/readerFontSize';

interface UseReaderKeybindingsOptions {
  onPrevChapter?: () => void;
  onNextChapter?: () => void;
  onToggleLayoutMode?: () => void;
  onToggleFocusMode?: () => void;
  onExitFocusMode?: () => void;
  fontSize?: ReaderFontSize;
  onFontSizeChange?: (size: ReaderFontSize) => void;
  disabled?: boolean;
}

export function useReaderKeybindings({
  onPrevChapter,
  onNextChapter,
  onToggleLayoutMode,
  onToggleFocusMode,
  onExitFocusMode,
  fontSize = 'md',
  onFontSizeChange,
  disabled = false,
}: UseReaderKeybindingsOptions) {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input, textarea o selector
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        (activeElement as HTMLElement)?.isContentEditable;

      if (isInput) return;

      // Escape siempre sale de modo enfoque
      if (e.key === 'Escape') {
        onExitFocusMode?.();
        return;
      }

      // No interceptar si se presionan modificadores como Ctrl, Alt o Meta (salvo shift)
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'k':
          e.preventDefault();
          onPrevChapter?.();
          break;

        case 'arrowright':
        case 'j':
          e.preventDefault();
          onNextChapter?.();
          break;

        case '[':
        case ']':
        case 'v':
          if (onToggleLayoutMode) {
            e.preventDefault();
            onToggleLayoutMode();
          }
          break;

        case 'f':
          e.preventDefault();
          onToggleFocusMode?.();
          break;

        case '+':
        case '=':
          if (onFontSizeChange) {
            e.preventDefault();
            const currPx = normalizeFontSizeToPx(fontSize);
            if (currPx < MAX_READER_FONT_SIZE) {
              onFontSizeChange(Math.min(MAX_READER_FONT_SIZE, currPx + 1));
            }
          }
          break;

        case '-':
        case '_':
          if (onFontSizeChange) {
            e.preventDefault();
            const currPx = normalizeFontSizeToPx(fontSize);
            if (currPx > MIN_READER_FONT_SIZE) {
              onFontSizeChange(Math.max(MIN_READER_FONT_SIZE, currPx - 1));
            }
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    disabled,
    onPrevChapter,
    onNextChapter,
    onToggleLayoutMode,
    onToggleFocusMode,
    onExitFocusMode,
    fontSize,
    onFontSizeChange,
  ]);
}
