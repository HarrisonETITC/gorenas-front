import { Validators } from "@angular/forms";
import { FormDataConfig, TextFormItem, BaseFormItemPort } from "@gorenas/domain";
import { StateField } from "./general/state.fields";

export class RoleForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear Rol';
        this.CREATE_FORM.buttonTitle = 'Crear';
        
        // Campo nombre del rol - TEXT
        const nameField = new TextFormItem(
            'name',
            BaseFormItemPort.TYPE_TEXT,
            'Nombre del rol',
            'security',
            null,
            [Validators.required]
        );

        // Crear copia del StateField con label personalizado
        const stateField = new (StateField.constructor as any)(
            StateField.name,
            'Estado del rol',
            StateField.options,
            StateField.icon,
            StateField.defaultValue,
            [Validators.required]
        );

        this.CREATE_FORM.fields = [
            nameField,
            stateField
        ];
    }
}