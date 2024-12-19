import { GeneralModel } from "../general/general.model";

export class PermissionModelView extends GeneralModel {
    public static readonly headers = new Map<string, string>();

    static {
        this.headers.set('id', 'ID');
        this.headers.set('name', 'Nombre del permiso');
        this.headers.set('role', 'Permiso asignado a')
    }

    name: string;
    role: string;
}