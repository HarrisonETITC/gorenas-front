export class Usuario {
    public static readonly ROL_ADMINISTRADOR = 'administrador';
    public static readonly ROL_PROPIETARIO = 'propietario';
    public static readonly ROL_GERENTE = 'gerente';
    public static readonly ROL_CAJERO = 'cajero';

    public static readonly ESTADO_ACTIVO = 'A';
    public static readonly ESTADO_INACTIVO = 'I';
    public static readonly MAPEOS_ESTADOS = new Map<string, string>();

    static {
        this.MAPEOS_ESTADOS.set(this.ESTADO_ACTIVO, 'Activo');
        this.MAPEOS_ESTADOS.set(this.ESTADO_INACTIVO, 'Inactivo');
    }

    id: number;
    email: string;
    nombres: string;
    apellidos: string;
    rol: string;
}