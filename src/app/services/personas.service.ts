import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl, basicHeaders } from '../environment';
import { Persona } from '@models/persona.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { INotificarGuardar } from '../core/interfaces/notificar-guardar.interface';
import { GenerarCampoAutoComplete } from '../core/interfaces/generar-auto-complete.interface';
import { FormItem } from '@models/formulario/form-item.model';

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
    return this.http.get<Array<Persona>>(`${apiUrl}/persona/mostrar?userId=${this.usuarioId}&rol=${this.rol}`, { headers: basicHeaders });
  }

  crearPersona(nueva: CreatePersonaData) {
    return this.http.post<CreatePersonaData>(`${apiUrl}/persona/crear`, nueva, { headers: basicHeaders });
  }

  editarPersona(editado: CreatePersonaData) {
    return this.http.put<CreatePersonaData>(`${apiUrl}/persona/actualizar`, editado, {headers: basicHeaders})
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

  generarAutoComplete(nombre: string, mostrar: string, icono: string): { item: FormItem; sub: Subscription; } {
    throw new Error('Method not implemented.');
  }

}
