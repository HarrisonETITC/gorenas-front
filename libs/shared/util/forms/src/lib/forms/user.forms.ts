import { Validators } from "@angular/forms";
import { FormDataConfig, TextFormItem, SelectFormItem, BaseFormItemPort } from "@gorenas/domain";
import { StateField } from "./general/state.fields";

export class UserForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear Usuario';
        this.CREATE_FORM.buttonTitle = 'Crear';
        
        // Campo email - TEXT
        const emailField = new TextFormItem(
            'email',
            BaseFormItemPort.TYPE_TEXT,
            'Email',
            'email',
            null,
            [Validators.required, Validators.email]
        );

        // Campo contraseña - PASSWORD (oculto en edición)
        const passwordField = new TextFormItem(
            'password',
            BaseFormItemPort.TYPE_PASSWORD,
            'Contraseña',
            'lock',
            null,
            [Validators.required, Validators.minLength(8)],
            false, // active
            false, // transparent
            true   // hideOnEdit
        );

        // Crear copia del StateField con label personalizado
        const stateField = new SelectFormItem(
            StateField.name,
            'Estado del usuario',
            StateField.options,
            StateField.icon
        );

        this.CREATE_FORM.fields = [
            emailField,
            passwordField,
            stateField
        ];
    }
}