import { ValidatorFn } from "@angular/forms";
import { ViewValue } from "../../general/view-value.model";
import { BaseFormItemAdapter } from "./base-form-item.adapter";
import { BaseFormItemPort } from "../../../interfaces/base-form-item.port";

/**
 * Clase específica para campos de tipo Select.
 * Contiene las opciones disponibles directamente como propiedad.
 * 
 * @example
 * ```typescript
 * const moduleField = new SelectFormItem(
 *   'module',
 *   'Módulo del permiso',
 *   AppUtil.getViewValuesFromMap(PermissionModel.MODULES_MAP),
 *   'category',
 *   null,
 *   [Validators.required]
 * );
 * ```
 */
export class SelectFormItem extends BaseFormItemAdapter<string> {
    /** Opciones disponibles para el select */
    options: Array<ViewValue>;

    constructor(
        name: string,
        label: string,
        options: Array<ViewValue> = [],
        icon: string = '',
        defaultValue: string = null,
        validators: Array<ValidatorFn> = [],
        active: boolean = false,
        transparent: boolean = false,
        hideOnEdit: boolean = false
    ) {
        super(name, BaseFormItemPort.TYPE_SELECT, label, icon, defaultValue, validators, active, transparent, hideOnEdit);
        this.options = options || [];
        this.validate();
    }

    override validate(): void | never {
        super.validate();
        
        if (!Array.isArray(this.options)) {
            this.options = [];
        }
        
        if (this.defaultValue && this.options.length > 0) {
            const isValidDefault = this.options.some(option => 
                option.value === this.defaultValue
            );
            if (!isValidDefault) {
                console.warn(`El valor por defecto "${this.defaultValue}" no está en las opciones disponibles para el campo "${this.name}"`);
            }
        }
    }
}