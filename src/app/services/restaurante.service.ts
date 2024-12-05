import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenerarCampoAutoComplete } from '../core/interfaces/generar-auto-complete.interface';
import { FormItem } from '@models/formulario/form-item.model';
import { BehaviorSubject, concatMap, filter, map, Observable, Subscription, throttleTime } from 'rxjs';
import { apiUrl, basicHeaders } from '../environment';
import { Restaurante } from '@models/restaurante.model';
import { AppUtil } from '@utils/app.util';
import { INotificarGuardar } from '../core/interfaces/notificar-guardar.interface';
import { IIdValor } from '@models/base/id-valor.interface';

@Injectable({
  providedIn: 'root'
})
export class RestauranteService implements GenerarCampoAutoComplete, INotificarGuardar {
  private readonly manejadorFormularios = new BehaviorSubject<string>('');

  private readonly http: HttpClient = inject(HttpClient);
  constructor() { }
  buscarDisponibles() {
    return this.http.get<Array<Restaurante>>(`${apiUrl}/restaurante/disponibles`, { headers: basicHeaders });
  }

  generarAutoComplete(nombre: string, mostrar: string, icono: string): { item: FormItem; sub: Subscription; } {
    const disponibles = new BehaviorSubject<Array<Restaurante>>([]);
    const nuevoSource: Observable<Array<IIdValor>> = disponibles.pipe(map((ress) => ress.map((res) => { return { id: res.id, valor: res.nombre } })));
    const manejador = new BehaviorSubject<string>('');

    const sub = manejador.asObservable().pipe(
      throttleTime(300, null, { leading: true, trailing: true }),
      filter((val) => !AppUtil.verificarVacio(val)),
      concatMap((filtro: string) => this.buscarDisponibles())
    ).subscribe((vals) => {
      disponibles.next(vals);
    });

    return {
      item: new FormItem(nombre, FormItem.TIPO_AUTOCOMPLETE, mostrar, icono, null, nuevoSource, manejador),
      sub
    }
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
