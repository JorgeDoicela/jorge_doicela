import { Pericope } from '../types';
import { API_URL } from '../../../../config';

export async function fetchPericopes(
  bookId: number,
  chapter: number,
): Promise<Pericope[]> {
  try {
    const res = await fetch(
      `${API_URL}/kartex/pericopes?bookId=${bookId}&chapter=${chapter}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return (json.data ?? json) as Pericope[];
  } catch (err) {
    console.warn('Error fetching pericopes:', err);
    return [];
  }
}
