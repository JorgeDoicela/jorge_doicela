import { useState, useEffect } from 'react';
import { Project } from '../types';

import { API_URL } from '../../../../config';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/software/projects`);
        if (!res.ok) {
          throw new Error('No se pudieron cargar los proyectos de software');
        }
        const data = await res.json();
        if (active) {
          setProjects(data.data as Project[]);
        }
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error al conectar con el servidor');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchProjects();
    return () => {
      active = false;
    };
  }, []);

  return { projects, loading, error };
}
