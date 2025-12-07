import { GeneralModel } from "../base/general.model";

export class PermissionModelView extends GeneralModel {
    public static readonly headers = new Map<string, string>();

    static {
        this.headers.set('id', 'ID');
        this.headers.set('module', 'Módulo');
        this.headers.set('component', 'Component');
        this.headers.set('action', 'Acción');
        this.headers.set('role', 'Permiso asignado a')
    }

    module: string;
    component: string;
    action: string;
    role: string;
    roleId?: number;
}