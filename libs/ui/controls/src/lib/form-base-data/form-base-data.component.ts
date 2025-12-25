import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AppUtil,
  FormDataServicePort,
  FORM_DATA_SERVICE,
  FIELDS_SERVICE,
  FormBaseServicePort,
  NOTIFICATION_SERVICE,
  NotificationServicePort,
  ErrorConfig,
  WarningConfig,
  FormCloseComponentPort,
  DestroySubsPort
} from '@gorenas/application-core';
import { FormDataConfig, FormsUtil, DebugLogger } from '@gorenas/shared-util-forms';
import { concatMap, filter, first, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { FormBaseComponent } from '../form-base/form-base.component';

@Component({
  selector: 'app-form-base-data',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, FormBaseComponent],
  templateUrl: './form-base-data.component.html',
  styleUrl: './form-base-data.component.css'
  // No providers - usa la instancia de FIELDS_SERVICE del padre (base-data.component.ts)
})
export class FormBaseDataComponent<T> implements OnInit, OnDestroy, FormCloseComponentPort, DestroySubsPort {
  @Input({ transform: (id: string) => +id }) id: number;
  @ViewChild(FormBaseComponent) private readonly formBase: FormBaseComponent;
  protected forms: Array<FormDataConfig>;
  protected actualForm: FormDataConfig;
  protected fieldsToDisplay: Array<any> = [];
  protected actualFormIndex: number = NaN;
  readonly finishSubs$ = new Subject<void>();
  private isEditForm: boolean = false;
  private doneProcess: boolean = false;

  constructor(
    @Inject(FORM_DATA_SERVICE)
    private readonly formDataService: FormDataServicePort,
    @Inject(FIELDS_SERVICE)
    private readonly fieldsService: FormBaseServicePort,
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

    DebugLogger.log('[FormBaseData] initForm - isEditForm:', this.isEditForm, 'id:', this.id);

    // Filtrar campos que tienen hideOnEdit=true si estamos en modo edición
    this.fieldsToDisplay = this.isEditForm
      ? this.actualForm.fields.filter(f => !f.hideOnEdit)
      : this.actualForm.fields;

    DebugLogger.log('[FormBaseData] Campos a usar:', this.fieldsToDisplay.map(f => ({ name: f.name, type: f.type })));

    if (!this.isEditForm)
      this.fieldsService.updateFields(this.fieldsToDisplay);
    else {
      DebugLogger.log('[FormBaseData] Llamando getById con id:', this.id);
      const options: Map<string, string> = new Map();
      options.set('isEdition', 'true');
      this.actualForm.dataInitializer.getById(this.id, options).pipe(
        tap(data => DebugLogger.log('[FormBaseData] Datos recibidos de getById:', data)),
        concatMap(data => FormsUtil.assignValuesOnFields(data, this.fieldsToDisplay)),
        tap(() => DebugLogger.log('[FormBaseData] Campos después de assignValues:', this.fieldsToDisplay.map(f => ({ name: f.name, defaultValue: f.defaultValue }))))
      ).subscribe({
        next: () => {
          DebugLogger.log('[FormBaseData] Llamando updateFields con preserveValues=false para cargar datos de edición');
          // En modo edición, forzar actualización de valores de los controles con los datos obtenidos
          this.fieldsService.updateFields(this.fieldsToDisplay, false);
        },
        error: (err) => {
          console.error('[FormBaseData] Error en getById:', err);
        }
      });
    }
  }
  protected goBack() {
    this.router.navigate([this.getReturnRoute()], { relativeTo: this.route });
  }
  protected handleFormMainButton() {
    // Debug: ver estado del formulario
    DebugLogger.log('[FormBaseData] Form valid:', this.formBase.form.valid);
    DebugLogger.log('[FormBaseData] Form controls:', Object.keys(this.formBase.form.controls).map(key => ({
      name: key,
      valid: this.formBase.form.controls[key].valid,
      errors: this.formBase.form.controls[key].errors,
      value: this.formBase.form.controls[key].value
    })));

    if (this.formBase.form.valid) {
      this.formDataService.sendFormEvent({
        event: this.isEditForm ? 'update' : 'create',
        id: this.isEditForm ? this.id : undefined
      });
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

  /**
   * Obtiene el título dinámico según si es creación o edición
   */
  protected getFormTitle(): string {
    if (!this.actualForm) return '';
    return this.actualForm.getTitle(this.isEditForm);
  }

  /**
   * Obtiene el texto del botón según si es creación o edición
   */
  protected getButtonTitle(): string {
    if (!this.actualForm) return '';
    return this.actualForm.getButtonTitle(this.isEditForm);
  }
}
