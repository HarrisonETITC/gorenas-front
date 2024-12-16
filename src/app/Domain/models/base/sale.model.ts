import { GeneralModel } from "../general/general.model";

export class SaleModel extends GeneralModel {
    public static readonly PAYMENT_METHOD_DEBIT = 'debito';
    public static readonly PAYMENT_METHOD_CREDIT = 'credito';
    public static readonly PAYMENT_METHOD_TRANSFERENCE = 'transferencia';
    public static readonly PAYMENT_METHOD_PLATFORMS = 'plataformas';
    public static readonly PAYMENT_METHOD_CASH = 'efectivo';
    public static readonly PAYMENT_METHODS = new Array<string>();

    static {
        this.PAYMENT_METHODS.push(this.PAYMENT_METHOD_DEBIT);
        this.PAYMENT_METHODS.push(this.PAYMENT_METHOD_CREDIT);
        this.PAYMENT_METHODS.push(this.PAYMENT_METHOD_TRANSFERENCE);
        this.PAYMENT_METHODS.push(this.PAYMENT_METHOD_PLATFORMS);
        this.PAYMENT_METHODS.push(this.PAYMENT_METHOD_CASH);
    }

    amount?: number;
    paymentMethod?: string;
    created?: Date;
    modified?: Date;
}