import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormItemModel } from '@Domain/models/forms/items/form-item.model';
import { AppUtil } from '@utils/app.util';
import { filter, ignoreElements, Observable, take, tap } from 'rxjs';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { SelectComponent } from '../select/select.component';
import { TextComponent } from '../text/text.component';
import { FormsUtil } from '@utils/forms.util';
import { AutocompleteFieldPort } from '@Application/ports/forms/auto-complete-field.port';
import { FIELDS_SERVICE } from '@Application/config/providers/form.providers';
import { FieldsServicePort } from '@Application/ports/forms/fields-service.port';

@Component({
  selector: 'app-form-base',
  imports: [ReactiveFormsModule, TextComponent, SelectComponent, DatePickerComponent, AutoCompleteComponent, MatIconModule, MatSlideToggleModule, MatTooltipModule],
  templateUrl: './form-base.component.html',
  styleUrl: './form-base.component.css'
})
export class FormBaseComponent<T = any> implements OnInit {
  public static readonly MODE_FORM = 'form';
  public static readonly MODE_CONTROLS = 'controls';
  @Input({ required: true }) fields: Array<FormItemModel>;
  @Input({ required: true }) mode: 'form' | 'controls';
  @Input({ required: false }) automaticUpdate: boolean;
  @Input({ required: false }) showAll: boolean;
  @Input({ required: false }) transparentFields?: boolean;
  @Output() onFieldChange = new EventEmitter<any>();

  protected actualFilter$: Observable<string>;
  controlsMap: Map<string, FormControl> = new Map();
  form = new FormGroup({});

  constructor(
    @Inject(FIELDS_SERVICE)
    private readonly service: FieldsServicePort
  ) { }

  ngOnInit(): void {
    this.init();
    if (this.automaticUpdate)
      this.service.getFields().pipe(
        filter(fields => !AppUtil.verifyEmptySimple(fields)),
        tap(fields => this.fields = fields)
      ).subscribe(() => { this.form = new FormGroup({}); this.init() });
  }
  init() {
    if (AppUtil.verifyEmptySimple(this.fields))
      this.fields = [];

    if (this.mode === FormBaseComponent.MODE_FORM)
      this.service.init(this.fields, this.form);
    else
      this.controlsMap = this.service.init(this.fields);

    this.service.manualUpdateFields();

    this.service.getFields().pipe(
      take(1),
      tap((fields: Array<FormItemModel>) => this.fields = fields),
      ignoreElements()
    ).subscribe();
  }
  protected isBasicControl(type: string) {
    return type === FormItemModel.TYPE_TEXT || type === FormItemModel.TYPE_PASSWORD || type === FormItemModel.TYPE_NUMBER;
  }
  protected isSelectControl(type: string) {
    return type === FormItemModel.TYPE_SELECT;
  }
  protected isDatePickerControl(type: string) {
    return type === FormItemModel.TYPE_DATETIME;
  }
  protected isAutoCompleteControl(type: string) {
    return type === FormItemModel.TYPE_AUTO_COMPLETE;
  }
  protected getControl(name: string): FormControl<any> {
    if (this.mode === FormBaseComponent.MODE_FORM)
      return this.form.get(name) as FormControl;

    return this.controlsMap.get(name);
  }
  protected updateAutoCompleteData(queryHandler: Observable<string>, field: FormItemModel): void {
    const formHandler = (FormsUtil.FORMS_HANDLER.get(FormItemModel.TYPE_AUTO_COMPLETE) as unknown as AutocompleteFieldPort);
    formHandler.updateAutoCompleteData(queryHandler, field);
  }
  protected handleEvents() {
    this.onFieldChange.emit();
  }
  buildObjectFromForm(): T {
    const obj = {};

    for (const field of this.fields) {
      const control = this.getControl(field.name);

      if (!AppUtil.verifyEmpty(control.value))
        obj[field.name] = control.value;

    }

    return (obj as T);
  }
  resetDefaultValues() {
    for (const field of this.fields) {
      this.service.setControlValue(field.name, field.defaultValue, (this.mode === FormBaseComponent.MODE_FORM) ? this.form : undefined);
    }
    this.onFieldChange.emit();
  }
}
