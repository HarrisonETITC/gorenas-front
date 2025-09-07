import { PermissionModel, ViewValue } from "@gorenas/domain";
import { RoleModel } from "@gorenas/domain";
import { FormItemModel } from "../items/form-item.model";
import { GeneralFilter } from "@gorenas/domain";

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
                selectOptions: {
                    options: Array.from(RoleModel.ROLES_NAMES.keys()).map(key =>  new ViewValue(key, RoleModel.ROLES_NAMES.get(key)))
                },
                active: true,
                transparent: true
            },
            {
                label: 'Nombre del módulo',
                name: 'module',
                icon: 'view_module_outline',
                type: FormItemModel.TYPE_SELECT,
                defaultValue: '',
                selectOptions: {
                    options: [new ViewValue('', 'Todos')].concat(Array.from(PermissionModel.MODULES_MAP.keys()).map(
                        key => new ViewValue(key, PermissionModel.MODULES_MAP.get(key))
                    ))
                },
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