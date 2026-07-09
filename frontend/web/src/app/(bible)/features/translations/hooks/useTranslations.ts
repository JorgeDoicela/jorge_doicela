import { useState, useEffect } from 'react';

export interface Translation {
  id: number;
  name: string;
  abbreviation: string;
  language: string;
}

export function useTranslations() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const res = await fetch(`${apiUrl}/bible/translations`);
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
  }, [apiUrl]);

  return { translations, loading, error };
}
