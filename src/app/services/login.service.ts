import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '@models/usuario.model';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { AppUtil } from '@utils/app.util';
import { apiUrl, basicHeaders } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly procesando: BehaviorSubject<boolean>;
  private logeado: BehaviorSubject<boolean>;

  constructor() {
    this.procesando = new BehaviorSubject(false);
    this.logeado = new BehaviorSubject(!AppUtil.verificarVacio(sessionStorage.getItem('token')));
  }

  iniciarSesion(email: string, contrasena: string): Observable<string> {
    this.cambiarProcesando();
    return this.http.post<{ token: string, usuario: { id: number } }>(
      `${apiUrl}/usuario/autenticar`,
      { username: email, password: contrasena },
      { headers: basicHeaders }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        this.cambiarProcesando(); return throwError(() => {
          return new Error(err.error.message)
        })
      }),
      map((data) => {
        this.cambiarProcesando()
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user_id', `${data.usuario.id}`);
        this.logeado.next(true);
        return 'Inicio de sesión correcto';
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

}
