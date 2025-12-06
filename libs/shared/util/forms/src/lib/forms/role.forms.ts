import { FormDataConfig, FormItemModel } from "@gorenas/domain";
import { StateField } from "./general/state.fields";
import { Validators } from "@angular/forms";

export class RoleForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear Rol';
        this.CREATE_FORM.buttonTitle = 'Crear';
        this.CREATE_FORM.fields = [
            {
                label: 'Nombre del rol',
                type: FormItemModel.TYPE_TEXT,
                name: 'name',
                icon: 'security',
                validators: [Validators.required],
            },
            {
                label: 'Estado del rol',
                ...StateField,
                validators: [Validators.required]
            }
        ];
    }
}