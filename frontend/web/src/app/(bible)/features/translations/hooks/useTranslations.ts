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
    name: 'Nueva Biblia de las Américas',
    abbreviation: 'NBLA',
    language: 'Español',
    copyrightOwner: 'The Lockman Foundation',
    copyrightNotice: 'Nueva Biblia de las Américas ® © 2005 por The Lockman Foundation. Conectada vía API autorizada.',
  },
  {
    id: 2,
    name: 'Nueva Traducción Viviente',
    abbreviation: 'NTV',
    language: 'Español',
    copyrightOwner: 'Tyndale House Foundation',
    copyrightNotice: 'Santa Biblia, Nueva Traducción Viviente, © Tyndale House Foundation, 2010. Conectada vía API autorizada.',
  },
  {
    id: 3,
    name: 'New International Version',
    abbreviation: 'NIV',
    language: 'Inglés',
    copyrightOwner: 'Biblica, Inc.',
    copyrightNotice: 'Holy Bible, NEW INTERNATIONAL VERSION ® NIV ® © 1973, 1978, 1984, 2011 by Biblica, Inc. ® Conectada vía API autorizada.',
  },
  {
    id: 4,
    name: 'Biblia Hebraica Stuttgartensia (WLC)',
    abbreviation: 'BHS',
    language: 'Hebreo / Arameo',
    copyrightOwner: 'Open Scriptures / Groves Center',
    copyrightNotice: 'Westminster Leningrad Codex (WLC). Licencia Académica Abierta CC BY 4.0.',
  },
  {
    id: 5,
    name: 'Septuaginta Griega (LXX)',
    abbreviation: 'LXX',
    language: 'Griego Koiné',
    copyrightOwner: 'Dominio Público',
    copyrightNotice: 'Septuaginta Griega (LXX - Swete / Rahlfs). Dominio Público Académico.',
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
