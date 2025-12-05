import { GeneralModel } from "./general.model";

export class SaleModel extends GeneralModel {
    public static readonly PAYMENT_METHOD_DEBIT = 'debito';
    public static readonly PAYMENT_METHOD_CREDIT = 'credito';
    public static readonly PAYMENT_METHOD_TRANSFERENCE = 'transferencia';
    public static readonly PAYMENT_METHOD_PLATFORMS = 'plataformas';
    public static readonly PAYMENT_METHOD_CASH = 'efectivo';
    public static readonly PAYMENT_METHODS = new Array<string>();
    public static readonly PAYMENT_METHODS_NAMES = new Map<string, string>();

    static {
        this.PAYMENT_METHODS.push(this.PAYMENT_METHOD_DEBIT);
        this.PAYMENT_METHODS.push(this.PAYMENT_METHOD_CREDIT);
        this.PAYMENT_METHODS.push(this.PAYMENT_METHOD_TRANSFERENCE);
        this.PAYMENT_METHODS.push(this.PAYMENT_METHOD_PLATFORMS);
        this.PAYMENT_METHODS.push(this.PAYMENT_METHOD_CASH);
        this.PAYMENT_METHODS_NAMES.set(this.PAYMENT_METHOD_DEBIT, 'Débito');
        this.PAYMENT_METHODS_NAMES.set(this.PAYMENT_METHOD_CREDIT, 'Crédito');
        this.PAYMENT_METHODS_NAMES.set(this.PAYMENT_METHOD_TRANSFERENCE, 'Transferencia');
        this.PAYMENT_METHODS_NAMES.set(this.PAYMENT_METHOD_PLATFORMS, 'Plataformas de pago');
        this.PAYMENT_METHODS_NAMES.set(this.PAYMENT_METHOD_CASH, 'Efectivo');
    }

    amount?: number;
    paymenthMethod?: string;
    created?: Date;
    modified?: Date;
}