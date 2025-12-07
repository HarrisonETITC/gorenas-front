import { ValidatorFn } from "@angular/forms";
import { InvalidFormItemDefaultValueException } from "../../../exceptions/invalid-form-item-default-value.exception";
import { BaseFormItemAdapter } from "./base-form-item.adapter";
import { BaseFormItemPort } from "../../../interfaces/base-form-item.port";

export class TextFormItem extends BaseFormItemAdapter<string | number> {
    constructor(
        name: string,
        type: typeof BaseFormItemPort.TYPE_TEXT | 
              typeof BaseFormItemPort.TYPE_PASSWORD | 
              typeof BaseFormItemPort.TYPE_NUMBER,
        label: string,
        icon: string = '',
        defaultValue: string | number = null,
        validators: Array<ValidatorFn> = [],
        active: boolean = false,
        transparent: boolean = false,
        hideOnEdit: boolean = false
    ) {
        super(name, type, label, icon, defaultValue, validators, active, transparent, hideOnEdit);
        this.validate();
    }

    override validate(): void | never {
        // Llamar validación del padre
        super.validate();
        
        // Solo validar defaultValue si se proporciona uno
        if (this.defaultValue !== null && this.defaultValue !== undefined) {
            if (this.type === BaseFormItemPort.TYPE_NUMBER && isNaN(Number(this.defaultValue))) {
                throw new InvalidFormItemDefaultValueException(
                    `El valor por defecto para este campo debe ser un número. Valor proporcionado: ${this.defaultValue}.`
                );
            }
        }
    }
}