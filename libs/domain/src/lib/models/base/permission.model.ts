import { GeneralModel } from "./general.model";
import { AppModel } from "./application.model";

export class PermissionModel extends GeneralModel {
    public static readonly MODULE_DASHBOARD = 'Dashboard';
    public static readonly MODULE_BRANCHES = 'Sucursales';
    public static readonly MODULE_EMPLOYEES = 'Empleados';
    public static readonly MODULE_SALES = 'Ventas';
    public static readonly MODULE_USERS = 'Usuarios';
    public static readonly MODULE_PERSONS = 'Personas';
    public static readonly MODULE_ROLES = 'Roles';
    public static readonly MODULE_PERMISSIONS = 'Permisos';
    public static readonly MODULES_MAP = new Map<string, string>();

    public static readonly ACTION_VIEW = "view";
    public static readonly ACTION_CREATE = "create";
    public static readonly ACTION_EDIT = "edit";
    public static readonly ACTION_DEACTIVATE = "deactivate";

    public static readonly ACTIONS = new Array<string>();
    public static readonly ACTIONS_MAP = new Map<string, string>();

    public static readonly COMPONENT_GENERAL = 'general';
    public static readonly COMPONENT_TABLE = 'table';
    public static readonly COMPONENT_FORM = 'filters';
    public static readonly COMPONENTS_MAP = new Map<string, string>();

    static {
        this.MODULES_MAP.set(AppModel.MODULE_BRANCHES, this.MODULE_BRANCHES);
        this.MODULES_MAP.set(AppModel.MODULE_EMPLOYEES, this.MODULE_EMPLOYEES);
        this.MODULES_MAP.set(AppModel.MODULE_SALES, this.MODULE_SALES);
        this.MODULES_MAP.set(AppModel.MODULE_USERS, this.MODULE_USERS);
        this.MODULES_MAP.set(AppModel.MODULE_PERSONS, this.MODULE_PERSONS);
        this.MODULES_MAP.set(AppModel.MODULE_ROLES, this.MODULE_ROLES);
        this.MODULES_MAP.set(AppModel.MODULE_PERMISSIONS, this.MODULE_PERMISSIONS);
        this.MODULES_MAP.set(AppModel.MODULE_DASHBOARD, this.MODULE_PERMISSIONS);

        this.ACTIONS.push(this.ACTION_VIEW);
        this.ACTIONS.push(this.ACTION_CREATE);
        this.ACTIONS.push(this.ACTION_EDIT);
        this.ACTIONS.push(this.ACTION_DEACTIVATE);
        this.ACTIONS_MAP.set(this.ACTION_VIEW, 'Ver');
        this.ACTIONS_MAP.set(this.ACTION_CREATE, 'Crear');
        this.ACTIONS_MAP.set(this.ACTION_EDIT, 'Editar');
        this.ACTIONS_MAP.set(this.ACTION_DEACTIVATE, 'Desactivar');

        this.COMPONENTS_MAP.set(this.COMPONENT_GENERAL, 'General');
        this.COMPONENTS_MAP.set(this.COMPONENT_TABLE, 'Tabla');
        this.COMPONENTS_MAP.set(this.COMPONENT_FORM, 'Filtros');
    }

    name!: string;
    role!: number;

    public PermissionModel() {
        this.name = '';
        this.role = 0;
    }
}