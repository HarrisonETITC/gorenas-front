import { MenuItem } from "./menu-item.model";

export class Menu {
    private static instance: Menu = null;

    private readonly items: Array<MenuItem>;

    private constructor() {
        this.items = new Array();
        this.items.push(
            new MenuItem('Dashboard', 'dashboard', 'home-outline', true),
            new MenuItem('Sucursales', 'sucursales', 'business-outline'),
            new MenuItem('Empleados', 'empleados', 'people-outline'),
            new MenuItem('Ventas', 'ventas', 'cash-outline')
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