import { RoleModel } from "@Domain/models/base/role.model";
import { MenuItem } from "./menu-item.model";
import { AppModel } from "@Domain/models/base/application.model";

export class Menu {
    private static instance: Menu = null;

    private readonly items: Array<MenuItem>;

    private constructor() {
        this.items = new Array();
        this.items.push(
            new MenuItem('Dashboard', AppModel.MODULE_DASHBOARD, 'home-outline'),
            new MenuItem('Sucursales', AppModel.MODULE_BRANCHES, 'business-outline'),
            new MenuItem('Empleados', AppModel.MODULE_EMPLOYEES, 'people-outline'),
            new MenuItem('Ventas', AppModel.MODULE_SALES, 'cash-outline'),
            new MenuItem('Usuarios', AppModel.MODULE_USERS, 'person-circle-outline', false, [RoleModel.ROLE_ADMINISTRATOR]),
            new MenuItem('Personas', AppModel.MODULE_PERSONS, 'person-add-outline'),
            new MenuItem('Roles', AppModel.MODULE_ROLES, 'document-lock-outline', false, [RoleModel.ROLE_ADMINISTRATOR]),
            new MenuItem('Permisos', AppModel.MODULE_PERMISSIONS, 'lock-open-outline', false, [RoleModel.ROLE_ADMINISTRATOR])
        );
    }

    public static getInstance() {
        if (this.instance === null)
            this.instance = new Menu();

        return this.instance;
    }

    getItems() {
        return this.items;
    }
}