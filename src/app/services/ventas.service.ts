import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl, basicHeaders } from '../environment';
import { Venta } from '@models/venta.model';
import { INotificarGuardar } from '../core/interfaces/notificar-guardar.interface';
import { BehaviorSubject } from 'rxjs';

export type createVentaData = {
  id?: number;
  monto: number;
  metodoPago: string;
  empleadoId: number;
}

@Injectable({
  providedIn: 'root'
})
export class VentasService implements INotificarGuardar {
  private readonly http = inject(HttpClient);
  private readonly usuario = sessionStorage.getItem('user_id');
  private readonly rol = sessionStorage.getItem('rol');
  private readonly manejadorFormularios = new BehaviorSubject<string>('');

  constructor() { }

  crearVenta(nueva: createVentaData) {
    return this.http.post<createVentaData>(`${apiUrl}/venta/crear`, nueva, { headers: basicHeaders() });
  }

  editarVenta(data: createVentaData) {
    return this.http.put<createVentaData>(`${apiUrl}/venta/actualizar`, data, { headers: basicHeaders() })
  }

  getVentaById(id: number) {
    return this.http.get<createVentaData>(`${apiUrl}/venta/id?ventaId=${id}`, { headers: basicHeaders() });
  }

  getMostrar() {
    return this.http.get<Array<Venta>>(`${apiUrl}/venta/mostrar?userId=${this.usuario}&rol=${this.rol}`, { headers: basicHeaders() });
  }

  getNotificador() {
    return this.manejadorFormularios.asObservable();
  }

  notificarGuardar(): void {
    this.manejadorFormularios.next('Guardar');
  }

  notificarEditar(): void {
    this.manejadorFormularios.next('Editar');
  }

  notificarTerminado(): void {
    this.manejadorFormularios.next('');
  }
}
