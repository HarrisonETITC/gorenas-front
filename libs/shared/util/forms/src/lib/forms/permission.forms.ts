import { Validators } from "@angular/forms";
import { AppUtil } from "@gorenas/application-core";
import { FormDataConfig, PermissionModel, SelectFormItem, AutoCompleteFormItem } from "@gorenas/domain";

export class PermissionForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear permiso';
        this.CREATE_FORM.buttonTitle = 'Crear';
        
        // Campo módulo - usando SelectFormItem
        const moduleField = new SelectFormItem(
            'module',
            'Módulo del permiso',
            AppUtil.getViewValuesFromMap(PermissionModel.MODULES_MAP),
            'category',
            null,
            [Validators.required]
        );

        // Campo componente - usando SelectFormItem
        const componentField = new SelectFormItem(
            'component',
            'Componente',
            AppUtil.getViewValuesFromMap(PermissionModel.COMPONENTS_MAP),
            'widgets',
            null,
            [Validators.required]
        );

        // Campo acción - usando SelectFormItem
        const actionField = new SelectFormItem(
            'action',
            'Acción del permiso',
            AppUtil.getViewValuesFromMap(PermissionModel.ACTIONS_MAP),
            'drag_handle',
            null,
            [Validators.required]
        );

        // Campo rol - usando AutoCompleteFormItem
        // El endpoint se configura en el componente (permission.component.ts)
        const roleField = new AutoCompleteFormItem(
            'roleId',
            'Rol asignado',
            null, // endpoint se asigna dinámicamente
            'lock_outline',
            null,
            [Validators.required]
        );

        this.CREATE_FORM.fields = [
            moduleField,
            componentField,
            actionField,
            roleField
        ];
    }
}