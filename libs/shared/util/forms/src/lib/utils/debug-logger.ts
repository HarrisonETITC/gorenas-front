import { isDevMode } from '@angular/core';

/**
 * Utilidad para logs de debug que solo se muestran en modo desarrollo
 */
export class DebugLogger {
  private static isDebugEnabled = isDevMode();

  static log(message: string, ...optionalParams: any[]): void {
    if (this.isDebugEnabled) {
      console.log(message, ...optionalParams);
    }
  }

  static warn(message: string, ...optionalParams: any[]): void {
    if (this.isDebugEnabled) {
      console.warn(message, ...optionalParams);
    }
  }

  static error(message: string, ...optionalParams: any[]): void {
    // Los errores siempre se muestran, incluso en producción
    console.error(message, ...optionalParams);
  }
}
