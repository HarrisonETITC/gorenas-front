import { Validators } from "@angular/forms";
import { FormDataConfig } from "@Domain/models/forms/form-data-config.model";
import { FormItemModel } from "@Domain/models/forms/items/form-item.model";

export class PermissionForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear permiso';
        this.CREATE_FORM.buttonTitle = 'Crear'
        this.CREATE_FORM.fields = [
            {
                label: 'Nombre del permiso',
                type: FormItemModel.TYPE_TEXT,
                name: 'name',
                icon: 'drag_handle',
                validators: [Validators.required],
                defaultValue: ''
            },
            {
                label: 'Rol asignado',
                type: FormItemModel.TYPE_AUTO_COMPLETE,
                name: 'role',
                icon: 'lock_outline',
                validators: [Validators.required],
                defaultValue: ''
            }
        ]
    }
}