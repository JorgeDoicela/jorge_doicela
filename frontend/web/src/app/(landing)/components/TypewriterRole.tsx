'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function TypewriterRole() {
    const { t, language } = useLanguage();
    const roles = t.roles;
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Reiniciar índice y texto cuando cambia el idioma
    useEffect(() => {
        setCurrentRoleIndex(0);
        setCurrentText('');
        setIsDeleting(false);
    }, [language]);

    useEffect(() => {
        const fullText = roles[currentRoleIndex] || roles[0];
        let timer: NodeJS.Timeout;

        if (isDeleting) {
            timer = setTimeout(() => {
                setCurrentText((prev) => prev.slice(0, -1));
            }, 30);
        } else {
            timer = setTimeout(() => {
                setCurrentText(fullText.slice(0, currentText.length + 1));
            }, 55);
        }

        if (!isDeleting && currentText === fullText) {
            timer = setTimeout(() => {
                setIsDeleting(true);
            }, 2200);
        } else if (isDeleting && currentText === '') {
            setIsDeleting(false);
            setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentRoleIndex, roles]);

    return (
        <div className="flex items-center justify-center min-h-[32px] sm:min-h-[24px] px-2" aria-live="polite">
            <p 
                className="text-xs sm:text-sm md:text-base text-text-subtitle font-semibold tracking-[-0.01em] uppercase text-center leading-normal"
                aria-label={`Especialidad: ${roles[currentRoleIndex] || roles[0]}`}
            >
                <span>{currentText}</span>
                <span className="inline-block w-1.5 h-3.5 md:h-4 bg-indigo-500/80 dark:bg-indigo-400/90 ml-1 animate-pulse rounded-xs align-middle" aria-hidden="true" />
            </p>
        </div>
    );
}
