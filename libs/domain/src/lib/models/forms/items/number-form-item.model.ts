import { ValidatorFn } from "@angular/forms";
import { BaseFormItemAdapter } from "./base-form-item.adapter";
import { BaseFormItemPort } from "../../../interfaces/base-form-item.port";
import { NumberFieldOptions } from "../options/number.options";

/**
 * Clase específica para campos de tipo Número.
 * Soporta opciones adicionales como filtros "mayor que" y "menor que".
 * 
 * @example
 * ```typescript
 * // Campo numérico simple
 * const priceField = new NumberFormItem(
 *   'price',
 *   'Precio',
 *   'attach_money'
 * );
 * 
 * // Campo numérico con filtros avanzados
 * const earningsField = new NumberFormItem(
 *   'earnings',
 *   'Ganancias',
 *   'attach_money',
 *   null,
 *   [],
 *   false,
 *   true,
 *   false,
 *   {
 *     enableGreatherThan: true,
 *     greatherThanLabel: ' (Mayor que)',
 *     enableLessThan: true,
 *     lessThanLabel: ' (Menor que)'
 *   }
 * );
 * ```
 */
export class NumberFormItem extends BaseFormItemAdapter<number | string> {
    /** Opciones para filtros avanzados de número */
    numberOptions?: NumberFieldOptions;

    constructor(
        name: string,
        label: string,
        icon: string = '',
        defaultValue: number | string = null,
        validators: Array<ValidatorFn> = [],
        active: boolean = false,
        transparent: boolean = false,
        hideOnEdit: boolean = false,
        numberOptions?: NumberFieldOptions
    ) {
        super(name, BaseFormItemPort.TYPE_NUMBER, label, icon, defaultValue, validators, active, transparent, hideOnEdit);
        this.numberOptions = numberOptions || {
            enableGreatherThan: false,
            enableLessThan: false
        };
        this.validate();
    }

    override validate(): void | never {
        super.validate();
        
        // Validar que el valor por defecto sea un número válido si se proporciona
        if (this.defaultValue !== null && this.defaultValue !== undefined && this.defaultValue !== '') {
            if (isNaN(Number(this.defaultValue))) {
                console.warn(`El valor por defecto "${this.defaultValue}" no es un número válido para el campo "${this.name}"`);
            }
        }
    }
}
