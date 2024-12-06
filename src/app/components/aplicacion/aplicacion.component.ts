import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MenuItem } from '@models/menu/menu-item.model';
import { AplicacionService } from '@services/aplicacion.service';
import { LoginService } from '@services/login.service';
import { AppUtil } from '@utils/app.util';
import { AuthUtils } from '@utils/auth.util';
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
  providers: [AplicacionService, LoginService]
})
export class AplicacionComponent implements OnInit {
  items: Array<MenuItem>;
  usuario$: Observable<vistaPersona>;
  nuevos = [
    /* { "email": "skywalker@example.com", "contrasena": "11111111" },
    { "email": "redfox@example.com", "contrasena": "11111111" },
    { "email": "bluestar@example.com", "contrasena": "11111111" },
    { "email": "greenleaf@example.com", "contrasena": "11111111" },
    { "email": "shadowwolf@example.com", "contrasena": "11111111" },
    { "email": "silvermoon@example.com", "contrasena": "11111111" },
    { "email": "goldfish@example.com", "contrasena": "11111111" },
    { "email": "purpleiris@example.com", "contrasena": "11111111" },
    { "email": "blackpanther@example.com", "contrasena": "11111111" },
    { "email": "whiteowl@example.com", "contrasena": "11111111" },
    { "email": "bronzetree@example.com", "contrasena": "11111111" },
    { "email": "crimsonrose@example.com", "contrasena": "11111111" },
    { "email": "greendragon@example.com", "contrasena": "11111111" },
    { "email": "icywind@example.com", "contrasena": "11111111" },
    { "email": "goldenlion@example.com", "contrasena": "11111111" },
    { "email": "aquaheart@example.com", "contrasena": "11111111" },
    { "email": "darkstorm@example.com", "contrasena": "11111111" },
    { "email": "firehawk@example.com", "contrasena": "11111111" },
    { "email": "swiftblade@example.com", "contrasena": "11111111" },
    { "email": "frozenriver@example.com", "contrasena": "11111111" },
    { "email": "silentwhisper@example.com", "contrasena": "11111111" },
    { "email": "burningember@example.com", "contrasena": "11111111" },
    { "email": "brightstar@example.com", "contrasena": "11111111" },
    { "email": "shiningpearl@example.com", "contrasena": "11111111" },
    { "email": "desertfox@example.com", "contrasena": "11111111" },
    { "email": "oceanwave@example.com", "contrasena": "11111111" },
    { "email": "forestguardian@example.com", "contrasena": "11111111" },
    { "email": "midnightwolf@example.com", "contrasena": "11111111" },
    { "email": "starlightbeam@example.com", "contrasena": "11111111" },
    { "email": "silverarrow@example.com", "contrasena": "11111111" },
    { "email": "hiddenshadow@example.com", "contrasena": "11111111" },
    { "email": "goldenphoenix@example.com", "contrasena": "11111111" },
    { "email": "brightflame@example.com", "contrasena": "11111111" },
    { "email": "autumnleaf@example.com", "contrasena": "11111111" },
    { "email": "icycrystal@example.com", "contrasena": "11111111" },
    { "email": "windrider@example.com", "contrasena": "11111111" },
    { "email": "stormbreaker@example.com", "contrasena": "11111111" },
    { "email": "moondancer@example.com", "contrasena": "11111111" },
    { "email": "nightshade@example.com", "contrasena": "11111111" },
    { "email": "wildfire@example.com", "contrasena": "11111111" },
    { "email": "thunderrage@example.com", "contrasena": "11111111" },
    { "email": "frostedge@example.com", "contrasena": "11111111" },
    { "email": "lightray@example.com", "contrasena": "11111111" },
    { "email": "twilightdream@example.com", "contrasena": "11111111" },
    { "email": "goldenkey@example.com", "contrasena": "11111111" },
    { "email": "emberwolf@example.com", "contrasena": "11111111" },
    { "email": "skydancer@example.com", "contrasena": "11111111" },
    { "email": "stonegazer@example.com", "contrasena": "11111111" },
    { "email": "firestorm@example.com", "contrasena": "11111111" },
    { "email": "crystalwing@example.com", "contrasena": "11111111" },
    { "email": "shadowhunter@example.com", "contrasena": "11111111" },
    { "email": "darkraven@example.com", "contrasena": "11111111" },
    { "email": "moonlitrose@example.com", "contrasena": "11111111" },
    { "email": "redstone@example.com", "contrasena": "11111111" },
    { "email": "thunderfang@example.com", "contrasena": "11111111" },
    { "email": "silentforest@example.com", "contrasena": "11111111" },
    { "email": "fierysoul@example.com", "contrasena": "11111111" },
    { "email": "blackflame@example.com", "contrasena": "11111111" },
    { "email": "silvermist@example.com", "contrasena": "11111111" },
    { "email": "goldendream@example.com", "contrasena": "11111111" } */
  ];

  constructor(
    private readonly aplicacionService: AplicacionService,
    private readonly loginService: LoginService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    for (const c of this.nuevos) {
      this.loginService.crearUsuario({ email: c.email, pass: c.contrasena }).subscribe();
    }

    const urlTree = this.router.parseUrl(this.router.url);
    const segments = urlTree.root.children['primary']?.segments || [];
    const componenteActivo = segments[segments.length - 1]?.path;

    this.items = this.aplicacionService.menu.getItems();
    this.items.forEach((item) => {
      item.activo = item.direccion.includes(componenteActivo);
    })
    this.usuario$ = this.aplicacionService.getPersonaInfo(parseInt(sessionStorage.getItem('user_id')))
      .pipe(
        map((usuario): vistaPersona => {
          sessionStorage.setItem('rol', usuario.rol)
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

  puedeVer(ruta: string) {
    return AuthUtils.verificarPuedeVer(ruta);
  }
}
