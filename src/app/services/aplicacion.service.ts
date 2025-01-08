import { inject, Injectable } from '@angular/core';
import { Menu } from '@models/menu/menu.model';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';
import { apiUrl, basicHeaders } from '../environment';
import { Persona } from '@models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class AplicacionService {
  menu = Menu.getInstance();
  private readonly http: HttpClient = inject(HttpClient);
  private readonly loginService: LoginService = inject(LoginService);

  constructor() { }

  getPersonaInfo(idUsuario: number) {
    return this.http.get<Persona>(`${apiUrl}/persona/info?id=${idUsuario}`, { headers: basicHeaders() });
  }

  cerrarSesion() {
    this.loginService.cerrarSesion();
  }

}
