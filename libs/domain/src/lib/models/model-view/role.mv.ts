import { GeneralModel } from "../base/general.model";

export class RoleModelView extends GeneralModel {
    public static readonly headers = new Map();

    static {
        this.headers.set('id', 'ID');
        this.headers.set('name', 'Nombre');
        this.headers.set('state', 'Estado');
        this.headers.set('users', 'Usuarios');
    }

    name: string;
    state: string;
    users?: number;
}