import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AppUtil,
  AutocompleteFieldPort,
  FormBaseServicePort,
  FIELDS_SERVICE,
  DestroySubsPort
} from '@gorenas/application-core';
import { 
  AutocompleteOptions, 
  FormItemModel,
  FormField,
  isSelectFormItem,
  isAutoCompleteFormItem,
  BaseFormItemPort
} from '@gorenas/domain';
import { FormsUtil } from '@gorenas/shared-util-forms';
import { filter, ignoreElements, Observable, of, Subject, take, takeUntil, tap } from 'rxjs';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { SelectComponent } from '../select/select.component';
import { TextComponent } from '../text/text.component';

@Component({
  selector: 'app-form-base',
  imports: [ReactiveFormsModule, TextComponent, SelectComponent, DatePickerComponent, AutoCompleteComponent, MatIconModule, MatSlideToggleModule, MatTooltipModule],
  templateUrl: './form-base.component.html',
  styleUrl: './form-base.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormBaseComponent<T = any> implements OnInit, OnDestroy, DestroySubsPort {
  public static readonly MODE_FORM = 'form';
  public static readonly MODE_CONTROLS = 'controls';

  @Input({ required: true }) fields: Array<FormField>;
  @Input({ required: true }) mode: 'form' | 'controls';
  @Input({ required: false }) automaticUpdate: boolean;
  @Input({ required: false }) showAll: boolean;
  @Input({ required: false }) transparentFields?: boolean;
  @Output() onFieldChange = new EventEmitter<any>();

  protected actualFilter$: Observable<string>;
  controlsMap: Map<string, FormControl> = new Map();
  form = new FormGroup({});

  readonly finishSubs$: Subject<void> = new Subject();
  private readonly emptyObservable$ = of([]);

  constructor(
    @Inject(FIELDS_SERVICE)
    private readonly service: FormBaseServicePort,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.init();
    if (this.automaticUpdate)
      this.service.getFields().pipe(
        filter(fields => !AppUtil.verifyEmptySimple(fields)),
        tap(fields => this.fields = fields),
        takeUntil(this.finishSubs$)
      ).subscribe(() => { this.form = new FormGroup({}); this.init() });
  }
  ngOnDestroy(): void {
    this.destroySubs();
  }

  destroySubs(): void {
    this.finishSubs$.next();
    this.finishSubs$.complete();
  }

  protected init() {
    if (AppUtil.verifyEmptySimple(this.fields))
      this.fields = [];

    // Pre-inicializar opciones para evitar NG0100
    this.initializeFieldOptions();

    if (this.mode === FormBaseComponent.MODE_FORM)
      this.service.init(this.fields, this.form);
    else
      this.controlsMap = this.service.init(this.fields);

    if (!this.automaticUpdate)
      this.service.manualUpdateFields();

    this.service.getFields().pipe(
      take(1),
      tap((fields: Array<FormField>) => {
        this.fields = fields;
        this.cdr.markForCheck();
      }),
      ignoreElements(),
      takeUntil(this.finishSubs$)
    ).subscribe();
    this.service.filtersEvent().pipe(
      filter(event => !AppUtil.verifyEmpty(event)),
      tap(event => {
        if (event === 'clean') {
          this.resetDefaultValues();
          this.service.sendFiltersEvent('');
        }
      }),
      ignoreElements(),
      takeUntil(this.finishSubs$)
    ).subscribe();
  }

  /**
   * Pre-inicializa las opciones de los campos para evitar errores NG0100
   * Funciona con el sistema legacy (FormItemModel) y las nuevas clases específicas
   */
  private initializeFieldOptions(): void {
    for (const field of this.fields) {
      // Para nuevas clases (AutoCompleteFormItem), ya tienen options$ inicializado
      if (isAutoCompleteFormItem(field)) {
        continue; // Las nuevas clases ya están inicializadas
      }
      // Para clases legacy (FormItemModel)
      if (field.type === BaseFormItemPort.TYPE_AUTO_COMPLETE) {
        const legacyField = field as FormItemModel;
        if (!legacyField.autocompleteOptions) {
          const autocompleteOpts = new AutocompleteOptions();
          autocompleteOpts.endpoint = null as any;
          autocompleteOpts.initOptionsSubject();
          legacyField.autocompleteOptions = autocompleteOpts;
        }
      }
      
      // Para nuevas clases (SelectFormItem), ya tienen options
      if (isSelectFormItem(field)) {
        continue;
      }
      // Para clases legacy (FormItemModel)
      if (field.type === BaseFormItemPort.TYPE_SELECT) {
        const legacyField = field as FormItemModel;
        if (!legacyField.selectOptions) {
          legacyField.selectOptions = { options: [] };
        }
      }
    }
  }

  /**
   * Obtiene las opciones de autocomplete de forma segura
   * Funciona con el sistema legacy (FormItemModel) y las nuevas clases específicas
   */
  protected getAutocompleteOptions(field: FormField): Observable<any[]> {
    // Nueva clase AutoCompleteFormItem
    if (isAutoCompleteFormItem(field)) {
      field.initOptionsSubject();
      return field.options$ ?? this.emptyObservable$;
    }
    
    // Clase legacy (FormItemModel)
    const legacyField = field as FormItemModel;
    const autocompleteOpts = legacyField.autocompleteOptions as AutocompleteOptions | undefined;
    if (autocompleteOpts && typeof autocompleteOpts.initOptionsSubject === 'function') {
      if (typeof autocompleteOpts.setFieldId === 'function') {
        autocompleteOpts.setFieldId(field.name);
      }
      autocompleteOpts.initOptionsSubject(field.name);
      return autocompleteOpts.options ?? this.emptyObservable$;
    }
    return autocompleteOpts?.options ?? this.emptyObservable$;
  }

  /**
   * Obtiene las opciones de select de forma segura
   * Funciona con el sistema legacy (FormItemModel) y las nuevas clases específicas
   */
  protected getSelectOptions(field: FormField): any[] {
    // Nueva clase SelectFormItem
    if (isSelectFormItem(field)) {
      return field.options ?? [];
    }
    
    // Clase legacy (FormItemModel)
    const legacyField = field as FormItemModel;
    return legacyField.selectOptions?.options ?? [];
  }
  protected isBasicControl(type: string) {
    return type === BaseFormItemPort.TYPE_TEXT || type === BaseFormItemPort.TYPE_PASSWORD || type === BaseFormItemPort.TYPE_NUMBER;
  }
  protected isSelectControl(type: string) {
    return type === BaseFormItemPort.TYPE_SELECT;
  }
  protected isDatePickerControl(type: string) {
    return type === BaseFormItemPort.TYPE_DATETIME;
  }
  protected isAutoCompleteControl(type: string) {
    return type === BaseFormItemPort.TYPE_AUTO_COMPLETE;
  }
  protected getControl(name: string): FormControl<any> {
    if (this.mode === FormBaseComponent.MODE_FORM)
      return this.form.get(name) as FormControl;

    return this.controlsMap.get(name);
  }
  protected updateAutoCompleteData(queryHandler: Observable<string>, field: FormField): void {
    const formHandler = (FormsUtil.FORMS_HANDLER.get(BaseFormItemPort.TYPE_AUTO_COMPLETE) as unknown as AutocompleteFieldPort);
    formHandler.updateAutoCompleteData(queryHandler, field);
  }
  protected handleEvents() {
    this.onFieldChange.emit();
  }
  resetDefaultValues() {
    for (const field of this.fields) {
      this.service.setControlValue(field.name, field.defaultValue, (this.mode === FormBaseComponent.MODE_FORM) ? this.form : undefined);
    }
    this.onFieldChange.emit();
  }
}
