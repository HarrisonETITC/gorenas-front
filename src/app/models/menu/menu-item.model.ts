export class MenuItem {
    name: string;
    pathTo: string;
    icon: string;
    active: boolean;
    useOutlineClass: boolean;
    roles: Array<string>;

    constructor(name: string, pathTo: string, icon: string, active?: boolean, roles: Array<string> = []) {
        this.name = name;
        this.pathTo = pathTo;
        this.icon = icon;
        this.active = active ?? false;
        this.roles = roles;
    }
}