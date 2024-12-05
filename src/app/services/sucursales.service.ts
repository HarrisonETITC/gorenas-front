import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Sucursal } from '@models/sucursal.model';
import { apiUrl, basicHeaders } from '../environment';
import { AppUtil } from '@utils/app.util';
import { Observable } from 'rxjs';

export type createSucursalData = { id?: number, direccion: string, mes: number, restauranteId: number };

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {
  private readonly http: HttpClient = inject(HttpClient);
  constructor() { }

  getSucursales(): Observable<Array<Sucursal>> {
    return this.http.get<Array<Sucursal>>(
      `${apiUrl}/sucursal/todos-restringido?userId=${AppUtil.getUserId()}&rol=${AppUtil.getRol()}`,
      {
        headers: basicHeaders
      }
    );
  }

  crearSucursal(data: createSucursalData) {
    return this.http.post<Sucursal>(
      `${apiUrl}/sucursal/crear`,
      { direccion: data.direccion, mes: data.mes, restauranteId: data.restauranteId },
      { headers: basicHeaders }
    )
  }

  editarSucursal(data: createSucursalData) {
    return this.http.put<createSucursalData>(`${apiUrl}/sucursal/actualizar`, data, { headers: basicHeaders });
  }

  getRestauranteBySucursalId(id: number) {
    return this.http.get<{ id: number, nombre: string }>(
      `${apiUrl}/sucursal/restaurante-sucursal?sucursalId=${id}`,
      { headers: basicHeaders }
    );
  }

  getSucursalById(id: number) {
    return this.http.get<createSucursalData>(`${apiUrl}/sucursal/id?sucursalId=${id}`, { headers: basicHeaders });
  }

}
