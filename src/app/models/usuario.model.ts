export class Usuario {
    public static readonly ROL_ADMINISTRADOR = 'administrador';
    public static readonly ROL_PROPIETARIO = 'propietario';
    public static readonly ROL_GERENTE = 'gerente';
    public static readonly ROL_CAJERO = 'cajero';

    id: number;
    email: string;
    nombres: string;
    apellidos: string;
    rol: string;
}