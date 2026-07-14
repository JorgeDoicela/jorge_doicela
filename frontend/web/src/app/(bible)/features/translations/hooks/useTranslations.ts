import { useState, useEffect } from 'react';

export interface Translation {
  id: number;
  name: string;
  abbreviation: string;
  language: string;
}

import { API_URL } from '../../../../config';

export function useTranslations() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const res = await fetch(`${API_URL}/bible/translations`);
        if (!res.ok) {
          throw new Error('No se pudieron cargar las traducciones');
        }
        const data = await res.json();
        setTranslations(data.data as Translation[]);
      } catch (err: any) {
        setError(err.message || 'Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    void fetchTranslations();
  }, []);

  return { translations, loading, error };
}
