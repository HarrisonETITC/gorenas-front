export class MenuItem {
    nombre: string;
    direccion: string;
    icono: string;
    activo: boolean;
    roles: Array<string>;

    constructor(nombre: string, direccion: string, icono: string, activo?: boolean, roles: Array<string> = []) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.icono = icono;
        this.activo = activo ?? false;
        this.roles = roles;
    }
}