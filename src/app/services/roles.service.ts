import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenerarCampoAutoComplete } from '../core/interfaces/generar-auto-complete.interface';
import { FormItem } from '@models/formulario/form-item.model';
import { BehaviorSubject, concatMap, filter, map, Observable, Subscription, throttleTime } from 'rxjs';
import { apiUrl, basicHeaders } from '../environment';
import { RolModel } from '@models/rol.model';
import { AppUtil } from '@utils/app.util';
import { IIdValor } from '@models/base/id-valor.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService implements GenerarCampoAutoComplete {
  private readonly rol = sessionStorage.getItem('rol');
  private readonly usuarioId = sessionStorage.getItem('user_id');
  private readonly http = inject(HttpClient);

  constructor() { }
  generarAutoComplete(nombre: string, mostrar: string, icono: string): { item: FormItem; sub: Subscription; } {
    const disponibles = new BehaviorSubject<Array<RolModel>>([]);
    const nuevoSource: Observable<Array<IIdValor>> = disponibles.pipe(map((ress) => ress.map((res) => { return { id: res.id, valor: res.nombre } })));
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

  getByPersonaId(id: number) {
    return this.http.get<RolModel>(`${apiUrl}/rol/persona?personaId=${id}`, { headers: basicHeaders });
  }

  private buscarDisponibles(query: string) {
    return this.http.get<Array<RolModel>>(`${apiUrl}/rol/disponibles?rol=${this.rol}&consulta=${query}`, { headers: basicHeaders })
  }

  private getRolByPersonaId(id: number) {
    return this.http.get(`${apiUrl}/rol/persona?personaId=${id}`, { headers: basicHeaders });
  }
}
