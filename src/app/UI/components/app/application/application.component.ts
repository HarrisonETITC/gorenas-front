import { AsyncPipe, CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { InfoConfig } from '@Application/adapters/services/notification/notification.configs';
import { APPLICATION_SERVICE } from '@Application/config/providers/app.providers';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { NOTIFICATION_SERVICE } from '@Application/config/providers/notification.providers';
import { PERSON_SERVICE } from '@Application/config/providers/person.providers';
import { ApiServicePort } from '@Application/ports/api-service.port';
import { ApplicationServicePort } from '@Application/ports/application-service.port';
import { AuthServicePort } from '@Application/ports/auth-service.port';
import { NotificationServicePort } from '@Application/ports/notification-service.port';
import { PersonPort } from '@Application/ports/person.port';
import { PersonModel } from '@Domain/models/base/person.model';
import { PersonModelView } from '@Domain/models/model-view/person.mv';
import { MenuItem } from '@models/menu/menu-item.model';
import { AplicacionService } from '@services/aplicacion.service';
import { LoginService } from '@services/login.service';
import { AuthUtils } from '@utils/auth.util';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-application',
  imports: [RouterOutlet, RouterModule, AsyncPipe],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AplicacionService, LoginService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationComponent implements OnInit {
  items: Array<MenuItem>;
  usuario$: Observable<PersonModelView>;
  protected activeComponent$: Observable<string>;

  constructor(
    @Inject(PERSON_SERVICE)
    private readonly personService: ApiServicePort<PersonModel, PersonModelView> & PersonPort,
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationServicePort,
    @Inject(APPLICATION_SERVICE)
    private readonly appService: ApplicationServicePort,
    private readonly aplicacionService: AplicacionService,
    private readonly loginService: LoginService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    const urlTree = this.router.parseUrl(this.router.url);
    const segments = urlTree.root.children['primary']?.segments || [];
    const componenteActivo = segments[segments.length - 1]?.path;

    this.items = this.aplicacionService.menu.getItems();
    this.items.forEach((item) => {
      item.activo = item.direccion.includes(componenteActivo);
    })
    this.usuario$ = this.personService.getPersonInfo();
    this.activeComponent$ = this.appService.activeComponent();
  }

  navigate(url: string) {
    this.router.navigate([`/app/${url}`])
  }

  salir() {
    this.authService.logout();
    this.notificationService.showNotification(InfoConfig('Hasta luego', 'Se ha cerrado su sesión'));
    this.router.navigate(['/home']);
  }

  canSeeSection(roles: Array<string>) {
    return this.authService.userHasRole(roles);
  }
}
