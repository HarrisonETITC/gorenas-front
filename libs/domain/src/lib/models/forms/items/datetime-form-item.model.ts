import { ValidatorFn } from "@angular/forms";
import { BaseFormItemAdapter } from "./base-form-item.adapter";
import { BaseFormItemPort } from "../../../interfaces/base-form-item.port";

/**
 * Clase específica para campos de tipo DateTime/DatePicker.
 * 
 * @example
 * ```typescript
 * const bornField = new DateTimeFormItem(
 *   'born',
 *   'Fecha de nacimiento',
 *   'cake',
 *   null,
 *   []
 * );
 * ```
 */
export class DateTimeFormItem extends BaseFormItemAdapter<Date | string> {
    constructor(
        name: string,
        label: string,
        icon: string = '',
        defaultValue: Date | string = null,
        validators: Array<ValidatorFn> = [],
        active: boolean = false,
        transparent: boolean = false,
        hideOnEdit: boolean = false
    ) {
        super(name, BaseFormItemPort.TYPE_DATETIME, label, icon, defaultValue, validators, active, transparent, hideOnEdit);
        this.validate();
    }

    override validate(): void | never {
        super.validate();
        
        // Validar que el defaultValue sea una fecha válida si se proporciona
        if (this.defaultValue !== null && this.defaultValue !== undefined) {
            if (typeof this.defaultValue === 'string') {
                const date = new Date(this.defaultValue);
                if (isNaN(date.getTime())) {
                    console.warn(`El valor por defecto "${this.defaultValue}" no es una fecha válida para el campo "${this.name}"`);
                }
            }
        }
    }
}
