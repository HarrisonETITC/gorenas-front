import { IIdValor } from "./base/id-valor.interface";

export class Venta {
    public static readonly mapeoCols = new Map();
    public static readonly METODOS_PAGO: Array<IIdValor> = [];

    static {
        this.mapeoCols.set('id', 'ID');
        this.mapeoCols.set('monto', 'Monto');
        this.mapeoCols.set('empleado', 'Realizada por');
        this.mapeoCols.set('sucursal', 'Sucursal');
        this.mapeoCols.set('metodo', 'Método de pago');
        this.mapeoCols.set('realizada', 'Fecha realizada');
        this.METODOS_PAGO.push({ id: 'debito', valor: 'Tarjeta de débito'});
        this.METODOS_PAGO.push({ id: 'credito', valor: 'Tarjeta de cŕedito'});
        this.METODOS_PAGO.push({ id: 'efectivo', valor: 'Pago en efectivo'});
        this.METODOS_PAGO.push({ id: 'transferencia', valor: 'Transferencia bancaria'});
        this.METODOS_PAGO.push({ id: 'plataformas', valor: 'Plataformas virtuales'});
    }

    id: number;
    monto: number;
    empleado: string;
    sucursal: string;
    metodo: string;
    realizada: Date;
}