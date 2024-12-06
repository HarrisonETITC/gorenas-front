import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '@models/usuario.model';
import { BehaviorSubject, catchError, concatMap, filter, map, Observable, Subscription, tap, throttleTime, throwError } from 'rxjs';
import { AppUtil } from '@utils/app.util';
import { apiUrl, basicHeaders } from '../environment';
import { UsuarioSendData } from '@models/sendData/usuario.senddata';
import { GenerarCampoAutoComplete } from '../core/interfaces/generar-auto-complete.interface';
import { FormItem } from '@models/formulario/form-item.model';
import { IIdValor } from '@models/base/id-valor.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService implements GenerarCampoAutoComplete {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly procesando: BehaviorSubject<boolean>;
  private logeado: BehaviorSubject<boolean>;
  private readonly userId = sessionStorage.getItem('user_id');
  private readonly rol = sessionStorage.getItem('rol');

  constructor() {
    this.procesando = new BehaviorSubject(false);
    this.logeado = new BehaviorSubject(!AppUtil.verificarVacio(sessionStorage.getItem('token')));
  }

  iniciarSesion(email: string, contrasena: string): Observable<any> {
    this.cambiarProcesando();
    return this.http.post<{ token: string, usuario: { id: number } }>(
      `${apiUrl}/usuario/autenticar`,
      { username: email, password: contrasena },
      { headers: basicHeaders() }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        this.cambiarProcesando(); return throwError(() => {
          return new Error(err.error.message)
        })
      }),
      tap((data: { token: string, usuario: { id: number } }) => {
        this.cambiarProcesando()
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user_id', `${data.usuario.id}`);
        this.logeado.next(true);
      })
    )
  }

  cerrarSesion(): void {
    sessionStorage.clear();
    this.logeado.next(false);
  }

  getAll(): Observable<Array<Usuario>> {
    this.cambiarProcesando();
    return this.http.get<Array<Usuario>>(`${apiUrl}/usuario/todos`).pipe(
      catchError((err) => { this.cambiarProcesando(); return throwError(() => err) }),
      tap(() => this.cambiarProcesando())
    );
  }

  buscarDisponibles(filtro: string): Observable<Array<Usuario>> {
    return this.http.get<Array<Usuario>>(`${apiUrl}/usuario/disponibles?consulta=${filtro}`, { headers: basicHeaders() });
  }

  crearUsuario(nuevo: UsuarioSendData) {
    return this.http.post<UsuarioSendData>(`${apiUrl}/usuario/crear`, nuevo, { headers: basicHeaders() });
  }

  editarUsuario(editar: UsuarioSendData) {
    return this.http.put<UsuarioSendData>(`${apiUrl}/usuario/actualizar`, editar, { headers: basicHeaders() });
  }

  getProcesando(): Observable<boolean> {
    return this.procesando.asObservable();
  }

  getLogeado(): Observable<boolean> {
    this.logeado = new BehaviorSubject(!AppUtil.verificarVacio(sessionStorage.getItem('token')));
    return this.logeado.asObservable();
  }

  private cambiarProcesando(): void {
    this.procesando.next(!this.procesando.value)
  }


  generarAutoComplete(nombre: string, mostrar: string, icono: string): { item: FormItem; sub: Subscription; } {
    const disponibles = new BehaviorSubject<Array<Usuario>>([]);
    const nuevoSource: Observable<Array<IIdValor>> = disponibles.pipe(map((usuarios) => usuarios.map((usuario) => { return { id: usuario.id, valor: usuario.email } })));
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
    return this.http.get<Usuario>(`${apiUrl}/usuario/persona?personaId=${id}`, { headers: basicHeaders() });
  }

  getUsuarios() {
    return this.http.get<Array<Usuario>>(`${apiUrl}/usuario/mostrar?userId=${this.userId}&rol=${this.rol}`, { headers: basicHeaders() })
  }

  buscarPorId(id: number) {
    return this.http.get<UsuarioSendData>(`${apiUrl}/usuario/id?id=${id}`, { headers: basicHeaders() });
  }

}
