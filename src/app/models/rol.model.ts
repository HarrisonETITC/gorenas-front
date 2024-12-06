export class RolModel {
    public static readonly mapeoCols = new Map();
    public static readonly ROL_ADMINISTRADOR = 'administrador';
    public static readonly ROL_PROPIETARIO = 'propietario';
    public static readonly ROL_GERENTE = 'gerente';
    public static readonly ROL_CAJERO = 'cajero';

    public static readonly ROLES = new Array<string>();

    static {
        RolModel.ROLES.push(RolModel.ROL_ADMINISTRADOR);
        RolModel.ROLES.push(RolModel.ROL_PROPIETARIO);
        RolModel.ROLES.push(RolModel.ROL_GERENTE);
        RolModel.ROLES.push(RolModel.ROL_CAJERO);
    }

    id: number;
    nombre: string;
    estado?: string;
}