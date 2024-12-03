import { inject, Injectable } from '@angular/core';
import { Menu } from '@models/menu/menu.model';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AplicacionService {
  menu = Menu.getInstance();
  private readonly loginService: LoginService = inject(LoginService);

  constructor() { }

  cerrarSesion() {
    this.loginService.cerrarSesion();
  }

}
