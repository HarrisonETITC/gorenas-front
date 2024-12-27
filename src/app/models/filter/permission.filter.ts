import { PermissionModel } from "@Domain/models/base/permission.model";
import { RoleModel } from "@Domain/models/base/role.model";
import { FormItemModel } from "@Domain/models/forms/form-item.model";
import { GeneralFilter } from "@models/base/general.filter";

export class PermissionFilter extends GeneralFilter {
    public static readonly FIELDS = new Array<FormItemModel>();

    static {
        this.FIELDS.push(
            {
                label: 'Nombre del rol',
                name: 'roleName',
                icon: 'tune_outline',
                type: FormItemModel.TYPE_SELECT,
                defaultValue: '',
                selectOptions: Array.from(RoleModel.ROLES_NAMES.keys()).map(key => { return { value: key, viewValue: RoleModel.ROLES_NAMES.get(key) } }),
                active: true,
                transparent: true
            },
            {
                label: 'Nombre del módulo',
                name: 'module',
                icon: 'view_module_outline',
                type: FormItemModel.TYPE_SELECT,
                defaultValue: '',
                selectOptions: [{ value: '', viewValue: 'Todos' }].concat(Array.from(PermissionModel.MODULES_MAP.keys()).map(
                    key => { return { value: key, viewValue: PermissionModel.MODULES_MAP.get(key) } }
                )),
                transparent: true
            },
            {
                label: 'Nombre del permiso',
                name: 'permission',
                icon: 'article_outline',
                type: FormItemModel.TYPE_TEXT,
                defaultValue: '',
                transparent: true
            }
        )
    }

    roleName: string;
    module: string;
    permission: string;
}