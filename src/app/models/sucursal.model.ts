export class Sucursal {
    public static readonly mapeoCols = new Map();

    static {
        this.mapeoCols.set('id', 'ID');
        this.mapeoCols.set('direccion', 'Dirección');
        this.mapeoCols.set('estado', 'Estado');
        this.mapeoCols.set('ganancias', 'Ganancias del mes');
        this.mapeoCols.set('creacion', 'Registado (Día - Hora)');
    }

    id: number;
    direccion: string;
    estado: string;
    ganancias: number;
    creacion: Date;
}