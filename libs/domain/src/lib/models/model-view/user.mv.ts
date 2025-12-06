import { GeneralModel } from "../base/general.model";

export class UserModelView extends GeneralModel {
    public static readonly headers = new Map();

    static {
        this.headers.set('id', 'ID');
        this.headers.set('email', 'Correo electrónico');
        this.headers.set('name', 'Nombre completo');
        this.headers.set('state', 'Estado');
        this.headers.set('role', 'Rol');
        this.headers.set('permissions', 'Permisos');
    }

    email: string;
    name: string;
    state: string;
    role: string;
    permissions: Array<string>;
}