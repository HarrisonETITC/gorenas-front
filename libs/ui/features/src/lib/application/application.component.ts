import { distinctUntilChanged, Observable, Subject, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import {
  InfoConfig,
  NOTIFICATION_SERVICE,
  APPLICATION_SERVICE,
  AUTH_SERVICE,
  PERSON_SERVICE,
  ApiServicePort,
  ApplicationServicePort,
  AuthServicePort,
  NotificationServicePort,
  PersonPort,
  DestroySubsPort
} from '@gorenas/application-core';
import { PersonModel, PersonModelView, MenuItem } from '@gorenas/domain';

@Component({
  selector: 'app-application',
  imports: [RouterOutlet, RouterModule, CommonModule, MatIconModule],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    const menu = this.service.getMenu();
    this.items = menu ? menu.getItems() : [];
    this.personInfo$ = this.personService.getPersonInfo();
    this.service.activeComponent().pipe(
      distinctUntilChanged(),
      tap(active => this.activeModule = active),
      takeUntil(this.finishSubs$)
    ).subscribe();
  }
  protected navigate(url: string) {
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
