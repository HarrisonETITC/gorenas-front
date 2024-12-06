import { inject, Injectable } from '@angular/core';
import { GenerarCampoAutoComplete } from '../core/interfaces/generar-auto-complete.interface';
import { FormItem } from '@models/formulario/form-item.model';
import { BehaviorSubject, concatMap, filter, map, Observable, Subscription, throttleTime } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrl, basicHeaders } from '../environment';
import { Empleado } from '@models/empleado.model';
import { IIdValor } from '@models/base/id-valor.interface';
import { AppUtil } from '@utils/app.util';

export type createEmpleadoData = {
  id?: number,
  salario: number,
  sucursalId: number,
  personaId: number
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService implements GenerarCampoAutoComplete {
  private readonly http = inject(HttpClient);
  private readonly userId = sessionStorage.getItem('user_id');
  private readonly rol = sessionStorage.getItem('rol');

  constructor() { }
  generarAutoComplete(nombre: string, mostrar: string, icono: string): { item: FormItem; sub: Subscription; } {
    const disponibles = new BehaviorSubject<Array<Empleado>>([]);
    const nuevoSource: Observable<Array<IIdValor>> = disponibles.pipe(map((empleados) => empleados.map((empleado) => { return { id: empleado.id, valor: empleado.nombre } })));
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

  getEmpleadoByVentaId(ventaId: number) {
    return this.http.get<Empleado>(`${apiUrl}/empleado/venta?ventaId=${ventaId}`, { headers: basicHeaders() });
  }

  private buscarDisponibles(query: string) {
    return this.http.get<Array<Empleado>>(`${apiUrl}/empleado/disponibles?userId=${this.userId}&rol=${this.rol}&consulta=${query}`)
  }

  getEmpleados() {
    return this.http.get<Array<Empleado>>(`${apiUrl}/empleado/mostrar?userId=${this.userId}&rol=${this.rol}`, { headers: basicHeaders() });
  }

  crearEmpleado(nuevo: createEmpleadoData) {
    return this.http.post<createEmpleadoData>(`${apiUrl}/empleado/crear`, nuevo, { headers: basicHeaders() })
  }

  editarEmpleado(editar: createEmpleadoData) {
    return this.http.put<createEmpleadoData>(`${apiUrl}/empleado/actualizar`, editar, { headers: basicHeaders() })
  }

  buscarPorId(id: number) {
    return this.http.get<createEmpleadoData>(`${apiUrl}/empleado/id?id=${id}`, { headers: basicHeaders() });
  }
}
