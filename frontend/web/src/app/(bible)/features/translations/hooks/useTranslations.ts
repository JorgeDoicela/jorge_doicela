import { useState, useEffect } from 'react';

export interface Translation {
  id: number;
  name: string;
  abbreviation: string;
  language: string;
  copyrightNotice?: string;
  copyrightOwner?: string;
}

export const CANONICAL_TRANSLATIONS: Translation[] = [
  {
    id: 1,
    name: 'Texto Hebreo Masorético',
    abbreviation: 'BHS',
    language: 'Hebreo / Arameo',
    copyrightOwner: 'Open Scriptures / Groves Center',
    copyrightNotice: 'Westminster Leningrad Codex (Biblia Hebraica Stuttgartensia). Dominio Público / Licencia Académica Abierta.',
  },
  {
    id: 2,
    name: 'Texto Crítico Griego',
    abbreviation: 'NA28',
    language: 'Griego Koiné',
    copyrightOwner: 'Dominio Público',
    copyrightNotice: 'Texto Crítico Griego (Novum Testamentum Graece — NA28 / UBS 5). Dominio Público Académico.',
  },
  {
    id: 3,
    name: 'Nueva Biblia de las Américas',
    abbreviation: 'NBLA',
    language: 'Español',
    copyrightOwner: 'The Lockman Foundation',
    copyrightNotice: 'Nueva Biblia de las Américas ® © 2005 por The Lockman Foundation. Conectada vía API autorizada.',
  },
  {
    id: 4,
    name: 'Nueva Traducción Viviente',
    abbreviation: 'NTV',
    language: 'Español',
    copyrightOwner: 'Tyndale House Foundation',
    copyrightNotice: 'Santa Biblia, Nueva Traducción Viviente, © Tyndale House Foundation, 2010. Conectada vía API autorizada.',
  },
  {
    id: 5,
    name: 'New International Version',
    abbreviation: 'NIV',
    language: 'Inglés',
    copyrightOwner: 'Biblica, Inc.',
    copyrightNotice: 'Holy Bible, NEW INTERNATIONAL VERSION ® NIV ® © 1973, 1978, 1984, 2011 by Biblica, Inc. ® Conectada vía API autorizada.',
  },
  {
    id: 6,
    name: 'Reina-Valera 1909',
    abbreviation: 'RV1909',
    language: 'Español',
    copyrightOwner: 'Dominio Público',
    copyrightNotice: 'Santa Biblia, Versión Reina-Valera (1909). Dominio Público Universal.',
  },
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
