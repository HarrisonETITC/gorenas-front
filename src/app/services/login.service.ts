import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { Usuario } from '@models/usuario.model';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { apiUrl } from '../environment';
import { AppUtil } from '@utils/app.util';
import { StorageService } from './storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly procesando: BehaviorSubject<boolean>;
  private readonly logeado: BehaviorSubject<boolean>;

  constructor(
    @Inject(StorageService) private readonly storage: StorageService
  ) {
    this.procesando = new BehaviorSubject(false);
    this.logeado = new BehaviorSubject(!AppUtil.verificarVacio(this.storage.get('token')));
    console.log(this.storage.get('token'));
  }

  iniciarSesion(email: string, contrasena: string): Observable<string> {
    this.cambiarProcesando();
    return this.http.post<{ token: string }>(`${apiUrl}/usuario/autenticar`, { username: email, password: contrasena }).pipe(
      catchError((err: HttpErrorResponse) => { this.cambiarProcesando(); return throwError(() => new Error(err.error.message)) }),
      map((data) => {
        this.cambiarProcesando()
        this.storage.set('token', data.token);
        this.logeado.next(true);
        return 'Inicio de sesión correcto';
      })
    )
  }

  cerrarSesion(): void {
    this.storage.clear();
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
    return this.logeado.asObservable();
  }

  private cambiarProcesando(): void {
    this.procesando.next(!this.procesando.value)
  }

}
