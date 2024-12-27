import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FIELDS_SERVICE, FORM_DATA_SERVICE } from '@Application/config/providers/form.providers';
import { FormDataServicePort } from '@Application/ports/forms/form-data-service.port';
import { AppUtil } from '@utils/app.util';
import { FormBaseComponent } from '../form-base/form-base.component';
import { filter, first, map, Observable, of, Subject, take, takeUntil, tap } from 'rxjs';
import { FormDataConfig } from '@Domain/models/forms/form-data-config.model';
import { FormsUtil } from '@utils/forms.util';
import { FieldsServicePort } from '@Application/ports/forms/fields-service.port';
import { NOTIFICATION_SERVICE } from '@Application/config/providers/notification.providers';
import { NotificationServicePort } from '@Application/ports/notification-service.port';
import { ErrorConfig, WarningConfig } from '@Application/adapters/services/notification/notification.configs';
import { NotificationButton } from '@models/menu/notification-button.model';
import { FormCloseComponent } from '@Domain/models/forms/form-close-component.interface';

@Component({
  selector: 'app-form-base-data',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, FormBaseComponent],
  templateUrl: './form-base-data.component.html',
  styleUrl: './form-base-data.component.css'
})
export class FormBaseDataComponent<T> implements OnInit, OnDestroy, FormCloseComponent {
  @Input({ transform: (id: string) => +id }) id: number;
  @ViewChild(FormBaseComponent) private readonly formBase: FormBaseComponent;
  protected forms: Array<FormDataConfig>;
  protected actualForm: FormDataConfig;
  protected actualFormIndex: number = NaN;
  private readonly finsihSubs$ = new Subject<void>();
  private isEditForm: boolean = false;
  private doneProcess: boolean = false;
  private readonly verifyCloseOptions: Array<NotificationButton> = [];

  constructor(
    @Inject(FORM_DATA_SERVICE)
    private readonly formDataService: FormDataServicePort,
    @Inject(FIELDS_SERVICE)
    private readonly fieldsService: FieldsServicePort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationSevice: NotificationServicePort,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.formDataService.getForms().pipe(
      tap(forms => {
        this.forms = forms;
        this.actualFormIndex = 0;
        this.initForm();
      }),
      takeUntil(this.finsihSubs$)
    ).subscribe();
    this.initOptions();
  }
  initOptions() {
    this.verifyCloseOptions.push(

    );
  }
  initForm() {
    if (AppUtil.verifyEmpty(this.forms)) return;

    this.isEditForm = !AppUtil.verifyEmpty(this.id);
    this.actualForm = this.forms[this.actualFormIndex];

    if (!this.isEditForm)
      this.fieldsService.updateFields(this.actualForm.fields);
    else {
      this.actualForm.dataInitializer.getById(this.id).pipe(
        tap(data => {
          FormsUtil.assignValuesOnFields(data, this.actualForm.fields)
        })
      ).subscribe(() => this.fieldsService.updateFields(this.actualForm.fields));
    }
  }
  ngOnDestroy() {
    this.finsihSubs$.next();
    this.finsihSubs$.complete();
  }
  goBackButton() {
    this.showCloseNotification();
    this.notificationSevice.buttonsResponse().pipe(
      filter(res => !AppUtil.verifyEmpty(res)),
      take(1)
    ).subscribe(() => this.goBack());
  }
  goBack() {
    this.router.navigate([this.getReturnRoute()], { relativeTo: this.route });
  }
  showCloseNotification() {
    this.notificationSevice.showNotification({
      ...WarningConfig('Pérdida de información', 'Si cierra el formulario va a perder los datos que no haya guardado ¿Desea continuar?'), buttons: [
        {
          option: { value: NotificationButton.ACCEPT_RESPONSE, viewValue: 'Aceptar' },
          icon: 'error_outline',
          filled: true
        },
        {
          option: { value: NotificationButton.CANCEL_RESPONSE, viewValue: 'Cancelar' },
          outlined: true
        }
      ],
      hideDismissButton: true,
      noClose: true
    })
  }
  handleFormMainButton() {
    if (this.formBase.form.valid) {
      this.formDataService.sendFormEvent({ event: this.isEditForm ? 'update' : 'create' });
      this.formDataService.getComponentEvent().pipe(
        filter(ev => ev.event === 'done' || ev.event === 'error'),
        first()
      ).subscribe((ev) => {
        if (ev.event === 'done') {
          this.doneProcess = true;
          this.goBack();
        }
        else {
          this.notificationSevice.showNotification(ErrorConfig('Hubo un error al guardar los datos', ev.message));
        }
      })
    } else {
      this.notificationSevice.showNotification(WarningConfig('Errores de validación', 'Tiene errores en el formulario'));
    }
  }
  closeConfirm(): Observable<boolean> {
    if (this.doneProcess)
      return of(true);

    return this.notificationSevice.buttonsResponse().pipe(
      filter(res => !AppUtil.verifyEmpty(res)),
      map(res => res === NotificationButton.ACCEPT_RESPONSE)
    );
  }
  getReturnRoute(): string {
    return !this.isEditForm ? '../' : '../../'
  }
  closeConfirmed(): void {
    this.notificationSevice.sendButtonsResponse('');
    this.formDataService.sendFormEvent({ event: '' });
    this.formDataService.updateState(false);
  }
  closeCanceled(): void {
    this.notificationSevice.sendButtonsResponse('');
  }
  preCloseComponent() {
    throw new Error('method not implemented');
  }
}
