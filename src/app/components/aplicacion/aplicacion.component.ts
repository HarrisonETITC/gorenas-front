import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MenuItem } from '@models/menu/menu-item.model';
import { Usuario } from '@models/usuario.model';
import { AplicacionService } from '@services/aplicacion.service';
import { AppUtil } from '@utils/app.util';
import { map, Observable } from 'rxjs';

export type vistaPersona = {
  nombre: string;
  cargo: string;
  email: string;
}

@Component({
  selector: 'app-aplicacion',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './aplicacion.component.html',
  styleUrl: './aplicacion.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AplicacionService]
})
export class AplicacionComponent implements OnInit {
  items: Array<MenuItem>;
  usuario$: Observable<vistaPersona>;

  constructor(
    private readonly aplicacionService: AplicacionService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.items = this.aplicacionService.menu.getItems();
    this.usuario$ = this.aplicacionService.getPersonaInfo(parseInt(sessionStorage.getItem('user_id')))
      .pipe(
        map((usuario): vistaPersona => {
          return {
            nombre: AppUtil.procesarNombre(usuario.nombres, usuario.apellidos),
            cargo: usuario.rol,
            email: usuario.email
          }
        })
      );
  }

  activarItem(nombre: string) {
    this.items.forEach(item => { item.activo = item.nombre == nombre; })
  }

  navegar(url: string) {
    this.router.navigate([`${url}`])
  }

  salir() {
    this.aplicacionService.cerrarSesion();
    this.router.navigate(['/home']);
  }
}
