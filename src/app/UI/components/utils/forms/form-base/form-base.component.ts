import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormItemModel } from '@Domain/models/form-item.model';
import { AppUtil } from '@utils/app.util';
import { BehaviorSubject, Observable, throttleTime, distinctUntilChanged } from 'rxjs';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { SelectComponent } from '../select/select.component';
import { TextComponent } from '../text/text.component';

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
  @Input({ required: true }) showAll: boolean;
  @Output() onFieldChange = new EventEmitter<any>();

  private readonly outputEventHandler = new BehaviorSubject<any>({});
  private readonly actualFilterHandler = new BehaviorSubject<string>('');
  protected actualFilter$: Observable<string>;
  readonly controlsMap: Map<string, FormControl> = new Map();
  readonly form = new FormGroup({});

  ngOnInit(): void {
    this.init();
    this.actualFilter$ = this.actualFilterHandler.asObservable();
  }

  init() {
    for (const field of this.fields) {
      const insertControl = new FormControl(field.defaultValue, { validators: (AppUtil.verifyEmpty(field.validators) ? [] : field.validators) })

      if (this.mode === FormBaseComponent.MODE_FORM)
        this.form.addControl(field.name, insertControl);
      else
        this.controlsMap.set(field.name, insertControl);
    }
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

    /* if (this.isSelectControl(field.type) && AppUtil.verifyEmpty(field.selectOptions)) {
      throw new Error(`Debe proveer las opciones para el componente de tipo select con nombre '${name}'`);
    }

    if (this.isAutoCompleteControl(field.type) && AppUtil.verifyEmpty(field.completeOptions))
      field.completeOptions = of([]); */
  }

  protected handleEvents() {
    this.onFieldChange.emit();
  }

  private initAutoCompleteData(fieldName: string, query?: string) {
    const field = this.fields.find(f => f.name === fieldName);
    field.completeOptions = field.completeOptionsFilter.getAvailable(query);
  }

  protected updateAutoCompleteData(queryHandler: Observable<string>, fieldName: string) {
    queryHandler.pipe(
      throttleTime(400, undefined, { leading: true, trailing: true }),
      distinctUntilChanged()
    )
      .subscribe(query => this.initAutoCompleteData(fieldName, query));
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
}
