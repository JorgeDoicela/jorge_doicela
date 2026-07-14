import { useState, useEffect } from 'react';

export interface Book {
  id: number;
  name: string;
  abbreviation: string;
  testament: 'OT' | 'NT';
}

import { API_URL } from '../../../../config';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/bible/books`);
        if (!res.ok) {
          throw new Error('No se pudieron cargar los libros');
        }
        const data = await res.json();
        setBooks(data.data as Book[]);
      } catch (err: any) {
        setError(err.message || 'Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    void fetchBooks();
  }, []);

  return { books, loading, error };
}
