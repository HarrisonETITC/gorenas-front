import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MenuItem } from '@models/menu/menu-item.model';
import { AplicacionService } from '@services/aplicacion.service';

@Component({
  selector: 'app-aplicacion',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './aplicacion.component.html',
  styleUrl: './aplicacion.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AplicacionService]
})
export class AplicacionComponent implements OnInit {
  items: Array<MenuItem>;

  constructor(
    private readonly aplicacionService: AplicacionService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.items = this.aplicacionService.menu.getItems();
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
