'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SandboxTerminal } from '../../features/terminal/components/SandboxTerminal';

function SandboxStandaloneContent() {
  const searchParams = useSearchParams();
  const rawMode = searchParams.get('mode');
  const targetMode: 'vps' | 'tunnel' = rawMode === 'tunnel' ? 'tunnel' : 'vps';

  return (
    <main className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden select-none">
      <SandboxTerminal isFullscreen={true} targetMode={targetMode} />
    </main>
  );
}

export default function SandboxStandalonePage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-background" />}>
      <SandboxStandaloneContent />
    </Suspense>
  );
}
