'use client';

import React from 'react';
import { LexiconView } from '../features/lexicons';

export const WordStudyView: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <LexiconView />
    </div>
  );
};

