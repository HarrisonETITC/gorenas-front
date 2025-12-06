import { Validators } from "@angular/forms";
import { FormDataConfig, FormItemModel } from "@gorenas/domain";
import { StateField } from "./general/state.fields";

export class UserForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear Usuario';
        this.CREATE_FORM.buttonTitle = 'Crear';
        this.CREATE_FORM.fields = [
            {
                label: 'Email',
                type: FormItemModel.TYPE_TEXT,
                name: 'email',
                icon: 'email',
                validators: [Validators.required, Validators.email]
            },
            {
                label: 'Contraseña',
                type: FormItemModel.TYPE_PASSWORD,
                name: 'password',
                icon: 'lock',
                validators: [Validators.required, Validators.minLength(8)],
                hideOnEdit: true
            },
            {
                label: 'Estado del usuario',
                ...StateField
            }
        ];
    }
}