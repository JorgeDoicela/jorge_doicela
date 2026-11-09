'use client';

/**
 * MobileSheetCoordinator
 *
 * Coordinador de exclusión mutua estricta para modales y bottom sheets móviles en KARTEX.
 * Arquitectura de capa única: garantiza que en pantallas móviles (< 1024px) NUNCA
 * puedan coexistir dos láminas inferiores (bottom sheets) o paneles modales abiertos
 * simultáneamente sobre la interfaz.
 */

type SheetDismissCallback = () => void;

class MobileSheetCoordinatorService {
  private activeSheetId: string | null = null;
  private dismissCallbacks = new Map<string, SheetDismissCallback>();

  /**
   * Registra una lámina o modal cuando se abre.
   * Si ya existía otra lámina abierta diferente a la actual, invoca su callback
   * de cierre de inmediato antes de registrar la nueva.
   */
  public registerOpen(sheetId: string, onDismiss: SheetDismissCallback): void {
    if (typeof window === 'undefined') return;

    // Si ya existe otra lámina abierta diferente, forzar su cierre inmediato
    if (this.activeSheetId && this.activeSheetId !== sheetId) {
      const prevId = this.activeSheetId;
      const prevDismiss = this.dismissCallbacks.get(prevId);

      // Actualizar el estado activo antes de invocar prevDismiss para prevenir reentrancia
      this.activeSheetId = sheetId;
      this.dismissCallbacks.set(sheetId, onDismiss);
      this.dismissCallbacks.delete(prevId);

      if (prevDismiss) {
        try {
          prevDismiss();
        } catch {
          // Fallback defensivo
        }
      }
      return;
    }

    this.activeSheetId = sheetId;
    this.dismissCallbacks.set(sheetId, onDismiss);
  }

  /**
   * Notifica que una lámina o modal se ha cerrado.
   */
  public registerClose(sheetId: string): void {
    if (this.activeSheetId === sheetId) {
      this.activeSheetId = null;
    }
    this.dismissCallbacks.delete(sheetId);
  }

  /**
   * Cierra cualquier lámina activa en la aplicación móvil.
   */
  public dismissAll(): void {
    if (this.activeSheetId) {
      const prevId = this.activeSheetId;
      const prevDismiss = this.dismissCallbacks.get(prevId);
      this.activeSheetId = null;
      this.dismissCallbacks.clear();
      if (prevDismiss) {
        try {
          prevDismiss();
        } catch {
          // Fallback defensivo
        }
      }
      return;
    }
    this.activeSheetId = null;
    this.dismissCallbacks.clear();
  }

  /**
   * Cierra cualquier lámina activa excepto la(s) indicada(s).
   */
  public dismissAllExcept(...excludedIds: string[]): void {
    if (this.activeSheetId && !excludedIds.includes(this.activeSheetId)) {
      const prevId = this.activeSheetId;
      const prevDismiss = this.dismissCallbacks.get(prevId);
      this.activeSheetId = null;
      this.dismissCallbacks.delete(prevId);
      if (prevDismiss) {
        try {
          prevDismiss();
        } catch {
          // Fallback defensivo
        }
      }
    }
  }

  /**
   * Consulta el identificador de la lámina activa actual.
   */
  public getActiveSheetId(): string | null {
    return this.activeSheetId;
  }

  /**
   * Consulta si una lámina específica es la actualmente activa.
   */
  public isActive(sheetId: string): boolean {
    return this.activeSheetId === sheetId;
  }
}

export const mobileSheetCoordinator = new MobileSheetCoordinatorService();

