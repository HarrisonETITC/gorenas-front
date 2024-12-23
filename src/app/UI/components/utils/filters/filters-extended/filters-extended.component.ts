import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AutoCompleteComponent } from '@components/utils/forms/auto-complete/auto-complete.component';
import { DatePickerComponent } from '@components/utils/forms/date-picker/date-picker.component';
import { SelectComponent } from '@components/utils/forms/select/select.component';
import { TextComponent } from '@components/utils/forms/text/text.component';
import { FormItemModel } from '@Domain/models/form-item.model';
import { AppUtil } from '@utils/app.util';
import { distinctUntilChanged, Observable, of, throttleTime } from 'rxjs';

@Component({
  selector: 'app-filters-extended',
  imports: [ReactiveFormsModule, TextComponent, SelectComponent, DatePickerComponent, AutoCompleteComponent, MatIconModule, MatSlideToggleModule],
  templateUrl: './filters-extended.component.html',
  styleUrl: './filters-extended.component.css'
})
export class FiltersExtendedComponent implements OnInit {
  protected readonly form = new FormGroup({});
  @Input({ required: true }) fields: Array<FormItemModel>;
  @Output() searchHandler = new EventEmitter<any>();
  @Output() autocompleteUpdater = new EventEmitter<{ name: string, updater: Observable<string> }>();
  autoSearch: boolean = false;

  ngOnInit(): void {
    for (const field of this.fields) {
      this.form.addControl(field.name, new FormControl(field.defaultValue, { validators: (AppUtil.verifyEmpty(field.validators) ? [] : field.validators) }));
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
    const control = (this.form.get(name) as FormControl<any>);
    const field = this.fields.find(f => f.name === name)

    if (this.isSelectControl(field.type) && AppUtil.verifyEmpty(field.selectOptions)) {
      throw new Error(`Debe proveer las opciones para el componente de tipo select con nombre '${name}'`);
    }

    if (this.isAutoCompleteControl(field.type) && AppUtil.verifyEmpty(field.completeOptions))
      field.completeOptions = of([]);

    return control;
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

  sendSearchEvent() {
    const send = this.buildObjectFromForm();
    this.searchHandler.emit(send);
  }

  protected handleEvents() {
    if (this.autoSearch && this.form.valid)
      this.sendSearchEvent();
  }

  private buildObjectFromForm(): any {
    const obj = {};

    for (const name of Object.keys(this.form.controls)) {
      const control = this.form.get(name);

      if (!AppUtil.verifyEmpty(control.value))
        obj[name] = this.form.get(name).value;

    }

    return obj;
  }
}
