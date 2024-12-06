import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl, basicHeaders } from '../environment';
import { Persona } from '@models/persona.model';
import { BehaviorSubject, concatMap, filter, map, Observable, Subscription, throttleTime } from 'rxjs';
import { INotificarGuardar } from '../core/interfaces/notificar-guardar.interface';
import { GenerarCampoAutoComplete } from '../core/interfaces/generar-auto-complete.interface';
import { FormItem } from '@models/formulario/form-item.model';
import { IIdValor } from '@models/base/id-valor.interface';
import { AppUtil } from '@utils/app.util';

export class CreatePersonaData {
  id?: number;
  nombres: string;
  apellidos: string;
  tipoId: string;
  identificacion: string;
  numContacto: string;
  rh: string;
  direccion: string;
  nacimiento: Date;
  usuarioId: number;
  rolId: number;
};

@Injectable({
  providedIn: 'root'
})
export class PersonasService implements GenerarCampoAutoComplete, INotificarGuardar {
  private readonly manejadorFormularios = new BehaviorSubject<string>('');
  private readonly http: HttpClient = inject(HttpClient);
  private readonly rol = sessionStorage.getItem('rol');
  private readonly usuarioId = sessionStorage.getItem('user_id');

  constructor() { }

  getPersonas() {
    return this.http.get<Array<Persona>>(`${apiUrl}/persona/mostrar?userId=${this.usuarioId}&rol=${this.rol}`, { headers: basicHeaders() });
  }

  crearPersona(nueva: CreatePersonaData) {
    return this.http.post<CreatePersonaData>(`${apiUrl}/persona/crear`, nueva, { headers: basicHeaders() });
  }

  editarPersona(editado: CreatePersonaData) {
    return this.http.put<CreatePersonaData>(`${apiUrl}/persona/actualizar`, editado, { headers: basicHeaders() })
  }

  getNotificador() {
    return this.manejadorFormularios.asObservable()
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

  generarAutoComplete(nombre: string, mostrar: string, icono: string): { item: FormItem; sub: Subscription; } {
    const disponibles = new BehaviorSubject<Array<CreatePersonaData>>([]);
    const nuevoSource: Observable<Array<IIdValor>> = disponibles.pipe(map((personas) => personas.map((persona) => { return { id: persona.id, valor: `${persona.nombres} ${persona.apellidos}` } })));
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

  getById(id: number) {
    return this.http.get<CreatePersonaData>(`${apiUrl}/persona/id?personaId=${id}`, { headers: basicHeaders() });
  }

  getByEmpleadoId(id: number) {
    return this.http.get<CreatePersonaData>(`${apiUrl}/persona/empleadoId?id=${id}`, { headers: basicHeaders() })
  }

  private buscarDisponibles(query: string) {
    return this.http.get<Array<CreatePersonaData>>(`${apiUrl}/persona/disponibles?query=${query}&userId=${this.usuarioId}&rol=${this.rol}`, { headers: basicHeaders() });
  }

}
