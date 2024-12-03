export class MenuItem {
    nombre: string;
    direccion: string;
    icono: string;
    activo: boolean;

    constructor(nombre: string, direccion: string, icono: string, activo?: boolean) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.icono = icono;
        this.activo = activo?? false;
    }
}