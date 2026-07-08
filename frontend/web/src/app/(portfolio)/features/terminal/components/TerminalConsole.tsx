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
      className="w-full max-w-4xl mx-auto rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-2xl p-6 font-mono text-sm cursor-text relative overflow-hidden"
    >
      {/* Decorative terminal header bar */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-900 text-slate-500 text-xs select-none">
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
        </div>
        <div>jorge@vps-1gb-ram: ~ (ssh)</div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></span>
          <span>{isConnected ? 'connected' : 'disconnected'}</span>
        </div>
      </div>

      {/* Output history */}
      <div className="h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 space-y-2 select-text whitespace-pre-wrap leading-relaxed text-slate-300">
        {history.map((line, index) => {
          // If this was a command sent by the user, render it with prompt prefix
          if (line.indexOf('\n') === -1 && !line.startsWith('Bienvenido') && !line.startsWith('[Error]') && !line.endsWith('~$ ')) {
            return (
              <div key={index} className="text-white font-semibold">
                <span className="text-indigo-400">jorge@vps-1gb-ram:~$</span> {line}
              </div>
            );
          }
          return <div key={index}>{line}</div>;
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex items-center mt-4">
        <span className="text-indigo-400 font-semibold select-none mr-2">jorge@vps-1gb-ram:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-white border-none outline-none focus:ring-0 p-0 font-mono"
          autoFocus
          placeholder="Escribe un comando..."
        />
      </form>
    </div>
  );
};
