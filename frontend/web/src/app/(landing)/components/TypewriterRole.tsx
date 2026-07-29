'use client';

import { useState, useEffect } from 'react';

const ROLES = [
    'DEVSECOPS, INTELIGENCIA ARTIFICIAL & CIBERSEGURIDAD',
    'FULL STACK DEVELOPER',
    'INGENIERÍA EN INTELIGENCIA ARTIFICIAL',
    'CIBERSEGURIDAD & CULTURA DEVSECOPS'
];

export default function TypewriterRole() {
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fullText = ROLES[currentRoleIndex];
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
            setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
        }

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentRoleIndex]);

    return (
        <div className="flex items-center min-h-[20px]">
            <p 
                className="text-[10px] md:text-xs text-text-subtitle font-mono tracking-widest uppercase mt-0.5 flex items-center"
                aria-label={`Especialidad: ${ROLES[currentRoleIndex]}`}
            >
                <span>{currentText}</span>
                <span className="inline-block w-1.5 h-3 md:h-3.5 bg-indigo-500/80 dark:bg-indigo-400/90 ml-1 animate-pulse rounded-xs" />
            </p>
        </div>
    );
}
