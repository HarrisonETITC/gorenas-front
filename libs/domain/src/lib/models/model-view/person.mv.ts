import { GeneralModel } from "../base/general.model";

export class PersonModelView extends GeneralModel {
    public static readonly headers = new Map();

    static {
        this.headers.set('id', 'ID');
        this.headers.set('email', 'Correo electrónico');
        this.headers.set('names', 'Nombres');
        this.headers.set('surnames', 'Apellidos');
        this.headers.set('identification', 'Identificación');
        this.headers.set('branch', 'Sucursal');
        this.headers.set('role', 'Rol');
    }

    email: string;
    names: string;
    surnames: string;
    identification: string;
    branch: string;
    role: string;
}