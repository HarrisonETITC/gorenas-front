export class AppModel {
    public static readonly MODULE_BRANCHES = 'branches';
    public static readonly MODULE_EMPLOYEES = 'employees';
    public static readonly MODULE_SALES = 'sales';
    public static readonly MODULE_USERS = 'users';
    public static readonly MODULE_PERSONS = 'persons';
    public static readonly MODULE_ROLES = 'roles';
    public static readonly MODULE_PERMISSIONS = 'permissions';
    public static readonly MODULE_DASHBOARD = 'dashboard';

    public static MODULES = new Array<string>();

    static {
        this.MODULES.push(this.MODULE_BRANCHES);
        this.MODULES.push(this.MODULE_EMPLOYEES);
        this.MODULES.push(this.MODULE_SALES);
        this.MODULES.push(this.MODULE_USERS);
        this.MODULES.push(this.MODULE_PERSONS);
        this.MODULES.push(this.MODULE_ROLES);
        this.MODULES.push(this.MODULE_PERMISSIONS);
        this.MODULES.push(this.MODULE_DASHBOARD);
    }
}