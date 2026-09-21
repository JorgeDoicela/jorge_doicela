/**
 * Utilidad de persistencia segura para entornos SSR y navegadores con restricciones
 * (modo incógnito, cookies bloqueadas, cuota de almacenamiento excedida).
 * Encapsula el acceso a localStorage previniendo excepciones no controladas y centralizando la resiliencia.
 */

export const safeStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignora de forma segura restricciones de almacenamiento o cuota excedida
    }
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignora de forma segura restricciones de almacenamiento
    }
  },

  getNumber(key: string, min = 0): number | null {
    const raw = this.getItem(key);
    if (!raw) return null;
    const parsed = parseInt(raw, 10);
    return !isNaN(parsed) && parsed >= min ? parsed : null;
  },

  getBoolean(key: string, defaultValue: boolean): boolean {
    const raw = this.getItem(key);
    if (raw === null) return defaultValue;
    return raw === 'true';
  },
};
