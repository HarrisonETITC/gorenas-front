import { PermissionModel, ViewValue, BaseFormItemPort, TextFormItem, SelectFormItem } from "@gorenas/domain";
import { RoleModel } from "@gorenas/domain";
import { GeneralFilter } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";

export class PermissionFilter extends GeneralFilter {
    public static readonly FIELDS = new Array<BaseFormItemPort>();

    static {
        this.FIELDS.push(
            new SelectFormItem(
                'roleName',
                'Nombre del rol',
                AppUtil.getViewValuesFromMap(RoleModel.ROLES_NAMES),
                'tune_outline',
                '',
                [],
                true,
                true
            ),
            new SelectFormItem(
                'module',
                'Nombre del módulo',
                [new ViewValue('', 'Todos')].concat(AppUtil.getViewValuesFromMap(PermissionModel.MODULES_MAP)),
                'view_module_outline',
                '',
                [],
                false,
                true
            ),
            new TextFormItem(
                'permission',
                BaseFormItemPort.TYPE_TEXT,
                'Nombre del permiso',
                'article_outline',
                '',
                [],
                false,
                true
            )
        )
    }

    roleName: string;
    module: string;
    permission: string;
}