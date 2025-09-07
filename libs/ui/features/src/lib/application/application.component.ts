import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { InfoConfig } from '@gorenas/application-core';
import { APPLICATION_SERVICE, AUTH_SERVICE } from '@gorenas/data-access-core';
import { NOTIFICATION_SERVICE } from '@gorenas/data-access-commons';
import { PERSON_SERVICE } from '@gorenas/data-access-features';
import { ApiServicePort } from '@gorenas/application-core';
import { ApplicationServicePort } from '@gorenas/application-core';
import { AuthServicePort } from '@gorenas/application-core';
import { NotificationServicePort } from '@gorenas/application-core';
import { PersonPort } from '@gorenas/application-core';
import { DestroySubsPort } from '@gorenas/application-core';
import { PersonModel } from '@gorenas/domain';
import { PersonModelView } from '@gorenas/domain';
import { MenuItem } from '@gorenas/domain';
import { distinctUntilChanged, Observable, Subject, takeUntil, tap } from 'rxjs';

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
    this.items = this.service.getMenu().getItems();
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
