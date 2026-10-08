'use client';

import React from 'react';
import { CommentariesDashboard } from '../../../features/commentaries';

export default function CommentariesStudyPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 animate-in fade-in duration-200">
      <CommentariesDashboard />
    </div>
  );
}
