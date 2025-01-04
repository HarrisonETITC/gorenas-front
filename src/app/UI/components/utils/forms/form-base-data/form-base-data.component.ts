import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FIELDS_SERVICE, FORM_DATA_SERVICE, FormsProviders } from '@Application/config/providers/form.providers';
import { FormDataServicePort } from '@Application/ports/forms/form-data-service.port';
import { AppUtil } from '@utils/app.util';
import { FormBaseComponent } from '../form-base/form-base.component';
import { concatMap, filter, first, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { FormDataConfig } from '@Domain/models/forms/form-data-config.model';
import { FormsUtil } from '@utils/forms.util';
import { FieldsServicePort } from '@Application/ports/forms/fields-service.port';
import { NOTIFICATION_SERVICE } from '@Application/config/providers/notification.providers';
import { NotificationServicePort } from '@Application/ports/notification-service.port';
import { ErrorConfig, WarningConfig } from '@Application/adapters/services/notification/notification.configs';
import { FormCloseComponent } from '@Domain/models/forms/form-close-component.interface';
import { DestroySubsPort } from '@Application/ports/utils/destroy-subs.port';

@Component({
  selector: 'app-form-base-data',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, FormBaseComponent],
  templateUrl: './form-base-data.component.html',
  styleUrl: './form-base-data.component.css',
  providers: [
    FormsProviders[0]
  ]
})
export class FormBaseDataComponent<T> implements OnInit, OnDestroy, FormCloseComponent, DestroySubsPort {
  @Input({ transform: (id: string) => +id }) id: number;
  @ViewChild(FormBaseComponent) private readonly formBase: FormBaseComponent;
  protected forms: Array<FormDataConfig>;
  protected actualForm: FormDataConfig;
  protected actualFormIndex: number = NaN;
  readonly finishSubs$ = new Subject<void>();
  private isEditForm: boolean = false;
  private doneProcess: boolean = false;

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
      takeUntil(this.finishSubs$)
    ).subscribe();
  }
  ngOnDestroy() {
    this.destroySubs();
    this.fieldsService.flushService();
  }

  destroySubs(): void {
    this.finishSubs$.next();
    this.finishSubs$.complete();
  }
  preCloseComponent() {
    throw new Error('method not implemented');
  }
  closeConfirm(): Observable<boolean> {
    return of(this.doneProcess);
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

  protected initForm() {
    if (AppUtil.verifyEmpty(this.forms)) return;

    this.isEditForm = !AppUtil.verifyEmpty(this.id);
    this.actualForm = this.forms[this.actualFormIndex];

    if (!this.isEditForm)
      this.fieldsService.updateFields(this.actualForm.fields);
    else {
      this.actualForm.dataInitializer.getById(this.id).pipe(
        concatMap(data => FormsUtil.assignValuesOnFields(data, this.actualForm.fields))
      ).subscribe(() => {
        this.fieldsService.updateFields(this.actualForm.fields)
      });
    }
  }
  protected goBack() {
    this.router.navigate([this.getReturnRoute()], { relativeTo: this.route });
  }
  protected handleFormMainButton() {
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
}
