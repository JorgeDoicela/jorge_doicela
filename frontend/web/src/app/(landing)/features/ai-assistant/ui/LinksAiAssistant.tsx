'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { AiAssistantChatModal } from './AiAssistantChatModal';

export function LinksAiAssistant() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Atajos de teclado: Ctrl + K (Abrir/Cerrar) y Esc (Cerrar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K o Cmd + K para alternar chat
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAiModalOpen((prev) => !prev);
        return;
      }

      // Esc para cerrar el chat si está abierto
      if (e.key === 'Escape' && isAiModalOpen) {
        e.preventDefault();
        setIsAiModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAiModalOpen]);

  return (
    <>
      {/* Botón Flotante Circular del Asistente de IA */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsAiModalOpen((prev) => !prev)}
          className="relative p-3.5 sm:p-4 rounded-full bg-card border border-card-border hover:border-card-hover-border text-foreground shadow-2xl backdrop-blur-2xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group flex items-center justify-center"
          aria-label="Abrir o cerrar asistente de IA"
          title="Asistente de IA · Jorge Doicela"
        >
          <MessageCircle size={22} className="text-indigo-600 dark:text-indigo-400" />
        </button>
      </div>

      {/* Modal Interactivo del Asistente de IA */}
      <AiAssistantChatModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </>
  );
}
