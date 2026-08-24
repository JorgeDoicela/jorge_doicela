'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterRoleProps {
  roles?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

const DEFAULT_ROLES = [
  'Full Stack Developer',
  'AI Engineer & Cybersecurity Specialist',
  'DevSecOps & Cloud Architect',
  'Software Engineer • Clean Architecture',
];

export const TypewriterRole: React.FC<TypewriterRoleProps> = ({
  roles = DEFAULT_ROLES,
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseDuration = 2200,
  className = '',
}) => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = roles[currentRoleIndex];
    let timeoutId: NodeJS.Timeout;

    if (!isDeleting) {
      // Estado de escritura
      if (displayedText.length < currentFullText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Pausa al terminar de escribir antes de borrar
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Estado de borrado
      if (displayedText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        // Pasar al siguiente rol
        setIsDeleting(false);
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, currentRoleIndex, roles, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <div
      className={`min-h-[1.5rem] font-mono text-xs md:text-sm tracking-wider uppercase ${className}`}
      aria-label={`Rol profesional: ${roles[currentRoleIndex]}`}
    >
      <span className="text-foreground/80 font-medium">
        {displayedText}
      </span>
      {/* Cursor titilante con estilo dorado y efecto glow */}
      <span
        className="inline-block w-2 h-3.5 ml-1 bg-gold-400 shadow-[0_0_8px_rgba(230,200,139,0.8)] animate-pulse align-middle"
        aria-hidden="true"
      />
    </div>
  );
};
