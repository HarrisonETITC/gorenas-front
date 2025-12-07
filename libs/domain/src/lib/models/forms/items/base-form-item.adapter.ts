import { ValidatorFn } from "@angular/forms";
import { BaseFormItemPort } from "../../../interfaces/base-form-item.port";

/**
 * Implementación base para todos los tipos de campos de formulario.
 * Proporciona la estructura común y validaciones básicas.
 */
export class BaseFormItemAdapter<T> extends BaseFormItemPort<T> {
    
    constructor(
        name: string,
        type: typeof BaseFormItemPort.TYPE_TEXT | 
              typeof BaseFormItemPort.TYPE_PASSWORD | 
              typeof BaseFormItemPort.TYPE_NUMBER |
              typeof BaseFormItemPort.TYPE_AUTO_COMPLETE |
              typeof BaseFormItemPort.TYPE_SELECT |
              typeof BaseFormItemPort.TYPE_DATETIME,
        label: string,
        icon: string = '',
        defaultValue: T = null,
        validators: Array<ValidatorFn> = [],
        active: boolean = false,
        transparent: boolean = false,
        hideOnEdit: boolean = false
    ) {
        super();
        this.name = name;
        this.type = type;
        this.label = label;
        this.icon = icon;
        this.defaultValue = defaultValue;
        this.validators = validators;
        this.active = active;
        this.transparent = transparent;
        this.hideOnEdit = hideOnEdit;
    }

    override validate(): void | never {
        // Validación base común
        if (!this.name?.trim()) {
            throw new Error('El nombre del campo es requerido');
        }
        if (!this.label?.trim()) {
            throw new Error('La etiqueta del campo es requerida');
        }
        if (!BaseFormItemPort.ITEM_TYPES.includes(this.type)) {
            throw new Error(`Tipo de campo inválido: ${this.type}`);
        }
    }
}