import { Observable } from "rxjs";

export interface INotificarGuardar {
    getNotificador(): Observable<string>;
    notificarGuardar(): void;
    notificarEditar(): void;
    notificarTerminado(): void;
}