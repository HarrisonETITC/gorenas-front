import { Validators } from "@angular/forms";
import { AppUtil } from "@gorenas/application-core";
import { FormDataConfig, PermissionModel } from "@gorenas/domain";
import { FormItemModel } from "@gorenas/domain";

export class PermissionForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear permiso';
        this.CREATE_FORM.buttonTitle = 'Crear'
        this.CREATE_FORM.fields = [
            {
                label: 'Módulo del permiso',
                type: FormItemModel.TYPE_SELECT,
                name: 'module',
                icon: 'category',
                validators: [Validators.required],
                selectOptions: {
                    options: AppUtil.getViewValuesFromMap(PermissionModel.MODULES_MAP)
                }
            },
            {
                label: 'Componente',
                type: FormItemModel.TYPE_SELECT,
                name: 'component',
                icon: 'widgets',
                validators: [Validators.required],
                selectOptions: {
                    options: AppUtil.getViewValuesFromMap(PermissionModel.COMPONENTS_MAP)
                }
            },
            {
                label: 'Acción del permiso',
                type: FormItemModel.TYPE_SELECT,
                name: 'action',
                icon: 'drag_handle',
                validators: [Validators.required],
                selectOptions: {
                    options: AppUtil.getViewValuesFromMap(PermissionModel.ACTIONS_MAP)
                }
            },
            {
                label: 'Rol asignado',
                type: FormItemModel.TYPE_AUTO_COMPLETE,
                name: 'roleId',
                icon: 'lock_outline',
                validators: [Validators.required],
                defaultValue: ''
            }
        ]
    }
}