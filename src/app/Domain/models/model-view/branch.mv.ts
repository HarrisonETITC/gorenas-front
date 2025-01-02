import { GeneralModel } from "../general/general.model";

export class BranchModelView extends GeneralModel {
    public static readonly headers = new Map();

    static {
        this.headers.set('id', 'ID');
        this.headers.set('name', 'Nombre de la sucursal');
        this.headers.set('address', 'Dirección');
        this.headers.set('state', 'Estado');
        this.headers.set('earnings', 'Ganancias del mes');
        this.headers.set('created', 'Registrado (Día - Hora)');
        this.headers.set('restaurantName', 'Restaurante')
    }

    name: string;
    address: string;
    state: string;
    earnings: number;
    created: Date;
    restaurantName: string;
}