'use client';

import React from 'react';
import { LiteraryAnalysisView } from '../../../features/literary-analysis';

export default function LiteraryStudyPage() {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <LiteraryAnalysisView />
    </div>
  );
}
