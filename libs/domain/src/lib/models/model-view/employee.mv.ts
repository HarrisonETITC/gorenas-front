import { GeneralModel } from "../base/general.model";

export class EmployeeModelView extends GeneralModel {
    public static readonly headers = new Map();

    static {
        this.headers.set('id', 'ID');
        this.headers.set('name', 'Nombre del empleado');
        this.headers.set('user', 'Email');
        this.headers.set('branch', 'Sucursal');
        this.headers.set('sales', 'Número de ventas');
        this.headers.set('salesAmmounth', 'Total vendido');
    }

    name: string;
    user: string;
    branch: string;
    sales: number;
    salesAmmounth: number;
}