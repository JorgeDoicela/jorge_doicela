'use client';

import React, { useEffect, useState } from 'react';
import { Verse } from '../types';
import { VerseCard } from './VerseCard';

export const VerseList: React.FC = () => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVerses = React.useCallback(async (bookName = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = bookName 
        ? `http://localhost:3000/bible/verses/search?book=${encodeURIComponent(bookName)}`
        : 'http://localhost:3000/bible/verses';
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('No se pudieron cargar los versículos');
      }
      const data = await res.json();
      setVerses(data as Verse[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (active) {
        await fetchVerses();
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [fetchVerses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVerses(search);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por libro (ej. Génesis, Juan)..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          Buscar
        </button>
      </form>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-center mb-6">
          {error}
        </div>
      )}

      {!loading && verses.length === 0 && (
        <p className="text-center text-slate-400 py-12">No se encontraron versículos.</p>
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
