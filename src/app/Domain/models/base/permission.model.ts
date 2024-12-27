import { GeneralModel } from "../general/general.model";
import { AppModel } from "./application.model";

export class PermissionModel extends GeneralModel {
    public static readonly MODULE_BRANCHES = 'Sucursales';
    public static readonly MODULE_EMPLOYEES = 'Empleados';
    public static readonly MODULE_SALES = 'Ventas';
    public static readonly MODULE_USERS = 'Usuarios';
    public static readonly MODULE_PERSONS = 'Personas';
    public static readonly MODULE_ROLES = 'Roles';
    public static readonly MODULE_PERMISSIONS = 'Permisos';
    public static readonly MODULES_MAP = new Map<string, string>();

    static {
        this.MODULES_MAP.set(AppModel.MODULE_BRANCHES ,this.MODULE_BRANCHES);
        this.MODULES_MAP.set(AppModel.MODULE_EMPLOYEES ,this.MODULE_EMPLOYEES);
        this.MODULES_MAP.set(AppModel.MODULE_SALES ,this.MODULE_SALES);
        this.MODULES_MAP.set(AppModel.MODULE_USERS ,this.MODULE_USERS);
        this.MODULES_MAP.set(AppModel.MODULE_PERSONS ,this.MODULE_PERSONS);
        this.MODULES_MAP.set(AppModel.MODULE_ROLES ,this.MODULE_ROLES);
        this.MODULES_MAP.set(AppModel.MODULE_PERMISSIONS ,this.MODULE_PERMISSIONS);
    }

    name: string;
    role: number;
}