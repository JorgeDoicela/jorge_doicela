import { useState, useEffect } from 'react';
import { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    let active = true;
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${apiUrl}/software/projects`);
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
  }, [apiUrl]);

  return { projects, loading, error };
}
