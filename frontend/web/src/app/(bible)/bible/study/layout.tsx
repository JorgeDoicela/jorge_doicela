'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { BiblePassageProvider } from '../../context/BiblePassageContext';
import { BibleHeaderNav } from '../../components/BibleHeaderNav';

export default function BibleStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BiblePassageProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          {/* Header Superior Fijo y Persistente */}
          <BibleHeaderNav />

          {/* Área Principal de Contenido */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-20 space-y-4">
            {children}
          </main>

          {/* Footer Persistente */}
          <footer className="border-t border-accents-2 w-full py-6 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-accents-4">
              <div>Jorge Doicela &copy; {new Date().getFullYear()} • Biblia Modular</div>
              <div className="flex gap-4">
                <Link href="/bible" className="hover:text-foreground transition-colors duration-150">
                  Presentación
                </Link>
                <span className="text-accents-2">|</span>
                <span className="hover:text-foreground transition-colors duration-150 cursor-default">
                  Sagradas Escrituras
                </span>
              </div>
            </div>
          </footer>
        </div>
      </BiblePassageProvider>
    </Suspense>
  );
}
