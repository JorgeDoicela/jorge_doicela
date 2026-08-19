import { useState, useEffect } from 'react';

export interface Translation {
  id: number;
  name: string;
  abbreviation: string;
  language: string;
}

export const CANONICAL_TRANSLATIONS: Translation[] = [
  { id: 1, name: 'Reina-Valera 1960', abbreviation: 'RV1960', language: 'Español' },
  { id: 2, name: 'Biblia Hebraica Stuttgartensia', abbreviation: 'BHS', language: 'Hebreo / Arameo' },
  { id: 3, name: 'Septuaginta Griega', abbreviation: 'LXX', language: 'Griego Koiné' },
  { id: 4, name: 'Nueva Versión Internacional', abbreviation: 'NVI', language: 'Español' },
  { id: 5, name: 'King James Version', abbreviation: 'KJV', language: 'Inglés' },
  { id: 6, name: 'La Biblia de las Américas', abbreviation: 'LBLA', language: 'Español' },
  { id: 7, name: 'Biblia de Jerusalén', abbreviation: 'JER', language: 'Español' },
];

import { API_URL } from '../../../../config';

export function useTranslations() {
  const [translations, setTranslations] = useState<Translation[]>(CANONICAL_TRANSLATIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchTranslations = async () => {
      try {
        const res = await fetch(`${API_URL}/bible/translations`);
        if (!res.ok) {
          throw new Error(`Servidor respondió con ${res.status}: No se pudieron cargar las traducciones`);
        }
        const data = await res.json();
        const serverTranslations = (data.data as Translation[]) || [];
        if (active && serverTranslations.length > 0) {
          setTranslations(serverTranslations);
        }
      } catch {
        // Mantiene el catálogo canónico de respaldo (7 versiones) si la API falla o está vacía
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchTranslations();
    return () => {
      active = false;
    };
  }, []);

  return { translations, loading, error };
}
