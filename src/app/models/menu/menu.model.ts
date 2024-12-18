import { RoleModel } from "@Domain/models/base/role.model";
import { MenuItem } from "./menu-item.model";

export class Menu {
    private static instance: Menu = null;

    private readonly items: Array<MenuItem>;

    private constructor() {
        this.items = new Array();
        this.items.push(
            new MenuItem('Dashboard', 'dashboard', 'home-outline'),
            new MenuItem('Sucursales', 'branches', 'business-outline'),
            new MenuItem('Empleados', 'employees', 'people-outline'),
            new MenuItem('Ventas', 'sales', 'cash-outline'),
            new MenuItem('Usuarios', 'users', 'person-circle-outline', false, [RoleModel.ROLE_ADMINISTRATOR]),
            new MenuItem('Personas', 'persons', 'person-add-outline'),
            new MenuItem('Roles', 'roles', 'document-lock-outline', false, [RoleModel.ROLE_ADMINISTRATOR]),
            new MenuItem('Permisos', 'permissions', 'lock-open-outline', false, [RoleModel.ROLE_ADMINISTRATOR])
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