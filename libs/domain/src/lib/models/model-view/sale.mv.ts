import { GeneralModel } from "../base/general.model";

export class SaleModelView extends GeneralModel {
    public static readonly headers = new Map();

    static {
        this.headers.set('id', 'ID');
        this.headers.set('amount', 'Monto');
        this.headers.set('employee', 'Realizada por');
        this.headers.set('branch', 'Sucursal');
        this.headers.set('paymenthMethod', 'Medio de pago');
        this.headers.set('created', 'Fecha de venta');
    }

    amount: number;
    employee: string;
    branch: string;
    paymenthMethod: string;
    created: Date;
}