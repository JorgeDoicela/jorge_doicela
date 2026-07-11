'use client';

import React from 'react';
import { VerseCard } from '../verse-card/VerseCard';
import { Verse } from '../../types';

interface VerseListProps {
  verses: Verse[];
  loading: boolean;
  error: string | null;
}

export const VerseList: React.FC<VerseListProps> = ({ verses, loading, error }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-foreground"></div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center mb-6">
          {error}
        </div>
      )}

      {!loading && verses.length === 0 && (
        <p className="text-center text-accents-5 text-sm py-12">No se encontraron versículos para esta selección.</p>
      )}

      {!loading && verses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {verses.map((verse) => (
            <VerseCard key={verse.id} verse={verse} />
          ))}
        </div>
      )}
    </div>
  );
};

