import { useState, useEffect } from 'react';

export interface Book {
  id: number;
  name: string;
  abbreviation: string;
  testament: 'OT' | 'NT';
}

export const CANONICAL_BOOKS: Book[] = [
  // Antiguo Testamento (39 libros)
  { id: 1, name: 'Génesis', abbreviation: 'GEN', testament: 'OT' },
  { id: 2, name: 'Éxodo', abbreviation: 'EXO', testament: 'OT' },
  { id: 3, name: 'Levítico', abbreviation: 'LEV', testament: 'OT' },
  { id: 4, name: 'Números', abbreviation: 'NUM', testament: 'OT' },
  { id: 5, name: 'Deuteronomio', abbreviation: 'DEU', testament: 'OT' },
  { id: 6, name: 'Josué', abbreviation: 'JOS', testament: 'OT' },
  { id: 7, name: 'Jueces', abbreviation: 'JUE', testament: 'OT' },
  { id: 8, name: 'Rut', abbreviation: 'RUT', testament: 'OT' },
  { id: 9, name: '1 Samuel', abbreviation: '1SA', testament: 'OT' },
  { id: 10, name: '2 Samuel', abbreviation: '2SA', testament: 'OT' },
  { id: 11, name: '1 Reyes', abbreviation: '1RE', testament: 'OT' },
  { id: 12, name: '2 Reyes', abbreviation: '2RE', testament: 'OT' },
  { id: 13, name: '1 Crónicas', abbreviation: '1CR', testament: 'OT' },
  { id: 14, name: '2 Crónicas', abbreviation: '2CR', testament: 'OT' },
  { id: 15, name: 'Esdras', abbreviation: 'ESD', testament: 'OT' },
  { id: 16, name: 'Nehemías', abbreviation: 'NEH', testament: 'OT' },
  { id: 17, name: 'Ester', abbreviation: 'EST', testament: 'OT' },
  { id: 18, name: 'Job', abbreviation: 'JOB', testament: 'OT' },
  { id: 19, name: 'Salmos', abbreviation: 'SAL', testament: 'OT' },
  { id: 20, name: 'Proverbios', abbreviation: 'PRO', testament: 'OT' },
  { id: 21, name: 'Eclesiastés', abbreviation: 'ECL', testament: 'OT' },
  { id: 22, name: 'Cantares', abbreviation: 'CAN', testament: 'OT' },
  { id: 23, name: 'Isaías', abbreviation: 'ISA', testament: 'OT' },
  { id: 24, name: 'Jeremías', abbreviation: 'JER', testament: 'OT' },
  { id: 25, name: 'Lamentaciones', abbreviation: 'LAM', testament: 'OT' },
  { id: 26, name: 'Ezequiel', abbreviation: 'EZE', testament: 'OT' },
  { id: 27, name: 'Daniel', abbreviation: 'DAN', testament: 'OT' },
  { id: 28, name: 'Oseas', abbreviation: 'OSE', testament: 'OT' },
  { id: 29, name: 'Joel', abbreviation: 'JOE', testament: 'OT' },
  { id: 30, name: 'Amós', abbreviation: 'AMO', testament: 'OT' },
  { id: 31, name: 'Abdías', abbreviation: 'ABD', testament: 'OT' },
  { id: 32, name: 'Jonás', abbreviation: 'JON', testament: 'OT' },
  { id: 33, name: 'Miqueas', abbreviation: 'MIQ', testament: 'OT' },
  { id: 34, name: 'Nahúm', abbreviation: 'NAH', testament: 'OT' },
  { id: 35, name: 'Habacuc', abbreviation: 'HAB', testament: 'OT' },
  { id: 36, name: 'Sofonías', abbreviation: 'SOF', testament: 'OT' },
  { id: 37, name: 'Hageo', abbreviation: 'HAG', testament: 'OT' },
  { id: 38, name: 'Zacarías', abbreviation: 'ZAC', testament: 'OT' },
  { id: 39, name: 'Malaquías', abbreviation: 'MAL', testament: 'OT' },
  // Nuevo Testamento (27 libros)
  { id: 40, name: 'Mateo', abbreviation: 'MAT', testament: 'NT' },
  { id: 41, name: 'Marcos', abbreviation: 'MAR', testament: 'NT' },
  { id: 42, name: 'Lucas', abbreviation: 'LUC', testament: 'NT' },
  { id: 43, name: 'Juan', abbreviation: 'JUA', testament: 'NT' },
  { id: 44, name: 'Hechos', abbreviation: 'HEC', testament: 'NT' },
  { id: 45, name: 'Romanos', abbreviation: 'ROM', testament: 'NT' },
  { id: 46, name: '1 Corintios', abbreviation: '1CO', testament: 'NT' },
  { id: 47, name: '2 Corintios', abbreviation: '2CO', testament: 'NT' },
  { id: 48, name: 'Gálatas', abbreviation: 'GAL', testament: 'NT' },
  { id: 49, name: 'Efesios', abbreviation: 'EFE', testament: 'NT' },
  { id: 50, name: 'Filipenses', abbreviation: 'FIL', testament: 'NT' },
  { id: 51, name: 'Colosenses', abbreviation: 'COL', testament: 'NT' },
  { id: 52, name: '1 Tesalonicenses', abbreviation: '1TE', testament: 'NT' },
  { id: 53, name: '2 Tesalonicenses', abbreviation: '2TE', testament: 'NT' },
  { id: 54, name: '1 Timoteo', abbreviation: '1TI', testament: 'NT' },
  { id: 55, name: '2 Timoteo', abbreviation: '2TI', testament: 'NT' },
  { id: 56, name: 'Tito', abbreviation: 'TIT', testament: 'NT' },
  { id: 57, name: 'Filemón', abbreviation: 'FLM', testament: 'NT' },
  { id: 58, name: 'Hebreos', abbreviation: 'HEB', testament: 'NT' },
  { id: 59, name: 'Santiago', abbreviation: 'STG', testament: 'NT' },
  { id: 60, name: '1 Pedro', abbreviation: '1PE', testament: 'NT' },
  { id: 61, name: '2 Pedro', abbreviation: '2PE', testament: 'NT' },
  { id: 62, name: '1 Juan', abbreviation: '1JU', testament: 'NT' },
  { id: 63, name: '2 Juan', abbreviation: '2JU', testament: 'NT' },
  { id: 64, name: '3 Juan', abbreviation: '3JU', testament: 'NT' },
  { id: 65, name: 'Judas', abbreviation: 'JUD', testament: 'NT' },
  { id: 66, name: 'Apocalipsis', abbreviation: 'APO', testament: 'NT' },
];

import { API_URL } from '../../../../config';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>(CANONICAL_BOOKS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/bible/books`);
        if (!res.ok) {
          throw new Error('No se pudieron cargar los libros desde el servidor');
        }
        const data = await res.json();
        const serverBooks = (data.data as Book[]) || [];
        if (active && serverBooks.length > 0) {
          setBooks(serverBooks);
        }
      } catch {
        // Mantiene el catálogo canónico de respaldo si la API falla o está vacía
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchBooks();
    return () => {
      active = false;
    };
  }, []);

  return { books, loading, error };
}
