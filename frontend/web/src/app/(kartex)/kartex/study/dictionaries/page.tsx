'use client';

import React from 'react';
import { DictionariesDashboard } from '../../../features/dictionaries';

export default function DictionariesStudyPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 animate-in fade-in duration-200">
      <DictionariesDashboard />
    </div>
  );
}

