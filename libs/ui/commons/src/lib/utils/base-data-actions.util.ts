import { BaseDataComponent } from "../base-data/base-data.component";

/**
 * Utilidades para trabajar con las acciones base del BaseDataComponent
 */
export class BaseDataActions {
  
  /**
   * Constantes de acciones base disponibles
   */
  static readonly BASE_ACTIONS = BaseDataComponent.BASE_ACTIONS;

  /**
   * Verifica si una acción es una acción base
   */
  static isBaseAction(action: string): boolean {
    return Object.values(BaseDataActions.BASE_ACTIONS).includes(action as any);
  }

  /**
   * Obtiene todas las acciones base disponibles
   */
  static getAllBaseActions(): string[] {
    return Object.values(BaseDataActions.BASE_ACTIONS);
  }

  /**
   * Helper para crear botones de tabla con acciones base
   */
  static createBaseActionButton(action: keyof typeof BaseDataActions.BASE_ACTIONS, label?: string, icon?: string) {
    return {
      action: BaseDataActions.BASE_ACTIONS[action],
      label: label || this.getDefaultLabel(action),
      icon: icon || this.getDefaultIcon(action)
    };
  }

  private static getDefaultLabel(action: keyof typeof BaseDataActions.BASE_ACTIONS): string {
    const labels = {
      EDIT: 'Editar',
      CREATE: 'Crear',
      VIEW: 'Ver'
    };
    return labels[action] || action.toLowerCase();
  }

  private static getDefaultIcon(action: keyof typeof BaseDataActions.BASE_ACTIONS): string {
    const icons = {
      EDIT: 'edit',
      CREATE: 'add',
      VIEW: 'visibility'
    };
    return icons[action] || 'action';
  }
}

/**
 * Tipo para acciones base
 */
export type BaseActionType = typeof BaseDataActions.BASE_ACTIONS[keyof typeof BaseDataActions.BASE_ACTIONS];
