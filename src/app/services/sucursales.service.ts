import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Sucursal } from '@models/sucursal.model';
import { apiUrl, basicHeaders } from '../environment';
import { AppUtil } from '@utils/app.util';
import { BehaviorSubject, concatMap, filter, map, Observable, Subscription, throttleTime } from 'rxjs';
import { GenerarCampoAutoComplete } from '../core/interfaces/generar-auto-complete.interface';
import { FormItem } from '@models/formulario/form-item.model';
import { IIdValor } from '@models/base/id-valor.interface';

export type createSucursalData = { id?: number, direccion: string, mes: number, restauranteId: number };

@Injectable({
  providedIn: 'root'
})
export class SucursalesService implements GenerarCampoAutoComplete {
  private readonly http: HttpClient = inject(HttpClient);
  constructor() { }

  getSucursales(): Observable<Array<Sucursal>> {
    return this.http.get<Array<Sucursal>>(
      `${apiUrl}/sucursal/todos-restringido?userId=${AppUtil.getUserId()}&rol=${AppUtil.getRol()}`,
      {
        headers: basicHeaders()
      }
    );
  }

  crearSucursal(data: createSucursalData) {
    return this.http.post<Sucursal>(
      `${apiUrl}/sucursal/crear`,
      { direccion: data.direccion, mes: data.mes, restauranteId: data.restauranteId },
      { headers: basicHeaders() }
    )
  }

  editarSucursal(data: createSucursalData) {
    return this.http.put<createSucursalData>(`${apiUrl}/sucursal/actualizar`, data, { headers: basicHeaders() });
  }

  getRestauranteBySucursalId(id: number) {
    return this.http.get<{ id: number, nombre: string }>(
      `${apiUrl}/sucursal/restaurante-sucursal?sucursalId=${id}`,
      { headers: basicHeaders() }
    );
  }

  getSucursalById(id: number) {
    return this.http.get<createSucursalData>(`${apiUrl}/sucursal/id?sucursalId=${id}`, { headers: basicHeaders() });
  }

  generarAutoComplete(nombre: string, mostrar: string, icono: string): { item: FormItem; sub: Subscription; } {
    const disponibles = new BehaviorSubject<Array<createSucursalData>>([]);
    const nuevoSource: Observable<Array<IIdValor>> = disponibles.pipe(map((sucursales) => sucursales.map((sucursal) => { return { id: sucursal.id, valor: sucursal.direccion } })));
    const manejador = new BehaviorSubject<string>('');

    const sub = manejador.asObservable().pipe(
      throttleTime(300, null, { leading: true, trailing: true }),
      filter((val) => !AppUtil.verificarVacio(val)),
      concatMap((filtro: string) => this.buscarDisponibles(filtro))
    ).subscribe((vals) => {
      disponibles.next(vals);
    });

    return {
      item: new FormItem(nombre, FormItem.TIPO_AUTOCOMPLETE, mostrar, icono, null, nuevoSource, manejador),
      sub
    }
  }

  private buscarDisponibles(filtro: string) {
    return this.http.get<Array<createSucursalData>>(`${apiUrl}/sucursal/disponibles?query=${filtro}`, { headers: basicHeaders() })
  }

  getSucursalByEmpleadoId(id: number) {
    return this.http.get<createSucursalData>(`${apiUrl}/sucursal/empleado-id?id=${id}`, { headers: basicHeaders() })
  }
}
