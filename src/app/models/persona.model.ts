import { IIdValor } from "./base/id-valor.interface";

export class Persona {
    public static readonly mapeoCols = new Map();
    public static readonly TIPOS_DOCUMENTO: Array<IIdValor> = [];
    public static readonly TIPOS_RH: Array<IIdValor> = [];

    static {
        this.mapeoCols.set('id', 'ID');
        this.mapeoCols.set('email', 'Usuario');
        this.mapeoCols.set('nombres', 'Nombres');
        this.mapeoCols.set('apellidos', 'Apellidos');
        this.mapeoCols.set('identificacion', 'Identificación');
        this.mapeoCols.set('sucursal', 'Sucursal');
        this.mapeoCols.set('rol', 'Rol');
        this.TIPOS_DOCUMENTO.push({ id: '', valor: '' });
        this.TIPOS_DOCUMENTO.push({ id: 'C.C', valor: 'Cédula de ciudadanía' });
        this.TIPOS_DOCUMENTO.push({ id: 'T.I', valor: 'Tarjeta de Identidad' });
        this.TIPOS_DOCUMENTO.push({ id: 'C.E', valor: 'Cédula de extranjería' });
        this.TIPOS_RH.push({ id: 'O+', valor: 'O+' });
        this.TIPOS_RH.push({ id: 'O-', valor: 'O-' });
        this.TIPOS_RH.push({ id: 'A+', valor: 'A+' });
        this.TIPOS_RH.push({ id: 'A-', valor: 'A-' });
        this.TIPOS_RH.push({ id: 'B+', valor: 'B+' });
        this.TIPOS_RH.push({ id: 'B-', valor: 'B-' });
        this.TIPOS_RH.push({ id: 'AB+', valor: 'AB+' });
        this.TIPOS_RH.push({ id: 'AB-', valor: 'AB-' });
    }

    id: number;
    nombres: string;
    apellidos: string;
    identificacion: string;
    email: string;
    sucursal: string;
    rol: string;
}