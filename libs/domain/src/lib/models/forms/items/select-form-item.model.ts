import { ValidatorFn } from "@angular/forms";
import { ViewValue } from "../../general/view-value.model";
import { BaseFormItemAdapter } from "./base-form-item.adapter";
import { BaseFormItemPort } from "../../../interfaces/base-form-item.port";

export class SelectFormItem extends BaseFormItemAdapter<ViewValue> {
    private _options: Array<ViewValue>;

    constructor(
        name: string,
        label: string,
        options: Array<ViewValue> = [],
        icon: string = '',
        defaultValue: ViewValue = null,
        validators: Array<ValidatorFn> = [],
        active: boolean = false,
        transparent: boolean = false
    ) {
        super(name, BaseFormItemPort.TYPE_SELECT, label, icon, defaultValue, validators, active, transparent);
        this._options = options || [];
        this.validate();
    }

    get options(): Array<ViewValue> {
        return this._options;
    }

    set options(options: Array<ViewValue>) {
        this._options = options || [];
    }

    override validate(): void | never {
        // Llamar validación del padre
        super.validate();
        
        // Asegurar que options es un array válido
        if (!Array.isArray(this._options)) {
            this._options = [];
        }
        
        // Validar que defaultValue esté en las opciones si se proporciona
        if (this.defaultValue && this._options.length > 0) {
            const isValidDefault = this._options.some(option => 
                option.value === this.defaultValue?.value
            );
            if (!isValidDefault) {
                console.warn(`El valor por defecto "${this.defaultValue.value}" no está en las opciones disponibles para el campo "${this.name}"`);
            }
        }
    }
}