export class Empleado {
    public static readonly mapeoCols = new Map();

    static {
        this.mapeoCols.set('id', 'ID');
        this.mapeoCols.set('nombre', 'Nombre');
        this.mapeoCols.set('usuario', 'Email');
        this.mapeoCols.set('sucursal', 'Sucursal');
        this.mapeoCols.set('ventas', 'Ventas realizadas (este mes)');
        this.mapeoCols.set('montoVentas', 'Valor de las ventas (este mes)');
    }

    id: number;
    nombre: string;
    usuario: string;
    sucursal: string;
    ventas: number;
    montoVentas: number;
}