import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
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
import { DestroySubsPort } from '@Application/ports/utils/destroy-subs.port';
import { PersonModel } from '@Domain/models/base/person.model';
import { PersonModelView } from '@Domain/models/model-view/person.mv';
import { MenuItem } from '@models/menu/menu-item.model';
import { AplicacionService } from '@services/aplicacion.service';
import { LoginService } from '@services/login.service';
import { distinctUntilChanged, Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-application',
  imports: [RouterOutlet, RouterModule, CommonModule, MatIconModule],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AplicacionService, LoginService]
})
export class ApplicationComponent implements OnInit, OnDestroy, DestroySubsPort {
  protected items: Array<MenuItem>;
  protected personInfo$: Observable<PersonModelView>;
  protected activeModule: string;
  finishSubs$: Subject<void> = new Subject();

  constructor(
    @Inject(PERSON_SERVICE)
    private readonly personService: ApiServicePort<PersonModel, PersonModelView> & PersonPort,
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationServicePort,
    @Inject(APPLICATION_SERVICE)
    private readonly service: ApplicationServicePort,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.init();
  }
  ngOnDestroy(): void {
    this.destroySubs();
  }

  destroySubs(): void {
    this.finishSubs$.next();
    this.finishSubs$.complete();
  }

  protected init() {
    this.items = this.service.getMenu().getItems();
    this.personInfo$ = this.personService.getPersonInfo();
    this.service.activeComponent().pipe(
      distinctUntilChanged(),
      tap(active => this.activeModule = active),
      takeUntil(this.finishSubs$)
    ).subscribe();
  }
  protected navigate(url: string) {
    this.notificationService.showNotification(InfoConfig('hola', 'holaaaaaa aaaaaaaaaa aaaaaaaaa a a a a a aa aaaaaaa'))
    this.router.navigate([`/app/${url}`]);
  }
  protected logOut() {
    this.authService.logout();
    this.notificationService.showNotification(InfoConfig('Hasta luego', 'Se ha cerrado su sesión'));
    this.router.navigate(['/home']);
  }
  protected canSeeSection(roles: Array<string>) {
    return this.authService.userHasRole(roles);
  }
}
