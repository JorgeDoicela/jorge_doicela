'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTerminalSocket } from '../hooks/useTerminalSocket';

export const TerminalConsole: React.FC = () => {
    const { history, sendCommand, isConnected } = useTerminalSocket();
    const [input, setInput] = useState('');
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendCommand(input);
        setInput('');
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <div
            onClick={focusInput}
            className="w-full max-w-4xl mx-auto rounded-xl bg-surface border border-gold-b shadow-2xl p-6 font-mono text-sm cursor-text relative overflow-hidden luxury-glow-hover transition-colors duration-200"
        >
            {/* Decorative terminal header bar */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gold-b/50 text-gold-s/70 text-xs select-none">
                <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-gold-p/70"></span>
                    <span className="w-3 h-3 rounded-full bg-gold-s/50"></span>
                    <span className="w-3 h-3 rounded-full bg-foreground/15"></span>
                </div>
                <div className="tracking-wider">Jorge Doicela</div>
                <div className="flex items-center gap-1.5">
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${isConnected
                            ? 'bg-gold-p shadow-[0_0_6px_rgba(197,168,128,0.8)] animate-pulse'
                            : 'bg-foreground/20'
                            }`}
                    ></span>
                    <span className="text-[10px] tracking-widest uppercase">
                        {isConnected ? 'online' : 'offline'}
                    </span>
                </div>
            </div>

            {/* Output history */}
            <div className="h-[400px] overflow-y-auto pr-2 space-y-2 select-text whitespace-pre-wrap leading-relaxed text-foreground/80 scrollbar-thin scrollbar-thumb-gold-b">
                {history.map((line, index) => {
                    // If this was a command sent by the user, render it with prompt prefix
                    if (
                        line.indexOf('\n') === -1 &&
                        !line.startsWith('Bienvenido') &&
                        !line.startsWith('[Error]') &&
                        !line.endsWith('~$ ')
                    ) {
                        return (
                            <div key={index} className="text-foreground font-medium tracking-wide">
                                <span className="text-gold-p">doicela@shell:~$</span> {line}
                            </div>
                        );
                    }
                    return <div key={index} className="text-foreground/60">{line}</div>;
                })}
                <div ref={terminalEndRef} />
            </div>

            {/* Input row */}
            <form onSubmit={handleSubmit} className="flex items-center mt-4 border-t border-gold-b/20 pt-4">
                <span className="text-gold-p font-medium select-none mr-2">doicela@shell:~$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent text-foreground border-none outline-none focus:ring-0 p-0 font-mono placeholder-gold-s/30"
                    autoFocus
                    placeholder="Escribe un comando o ayuda..."
                />
            </form>
        </div>
    );
};
