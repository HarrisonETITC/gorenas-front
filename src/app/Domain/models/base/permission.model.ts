import { GeneralModel } from "../general/general.model";

export class PermissionModel extends GeneralModel {
    public static readonly MODULE_BRANCHES = 'Sucursales';
    public static readonly MODULE_EMPLOYEES = 'Empleados';
    public static readonly MODULE_SALES = 'Ventas';
    public static readonly MODULE_USERS = 'Usuarios';
    public static readonly MODULE_PERSONS = 'Personas';
    public static readonly MODULE_ROLES = 'Roles';
    public static readonly MODULE_PERMISSIONS = 'Permisos';
    public static readonly MODULES = new Array<string>();

    static {
        this.MODULES.push(this.MODULE_BRANCHES);
        this.MODULES.push(this.MODULE_EMPLOYEES);
        this.MODULES.push(this.MODULE_SALES);
        this.MODULES.push(this.MODULE_USERS);
        this.MODULES.push(this.MODULE_PERSONS);
        this.MODULES.push(this.MODULE_ROLES);
        this.MODULES.push(this.MODULE_PERMISSIONS);
    }

    name: string;
    role: number;
}