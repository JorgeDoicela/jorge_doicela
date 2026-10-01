'use client';

import React from 'react';
import { ArchaeologyFeedDashboard } from '../../../features/archaeology-feed';

export default function ArchaeologyStudyPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 animate-in fade-in duration-200">
      <ArchaeologyFeedDashboard />
    </div>
  );
}
