import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBaseComponent } from '@components/utils/forms/form-base/form-base.component';
import { FormItemModel } from '@Domain/models/forms/form-item.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IdValue } from '@Domain/models/general/id-value.interface';
import { ViewValue } from '@Domain/types/view-value.type';
import { AppUtil } from '@utils/app.util';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-filters-compact',
  imports: [FormBaseComponent, MatMenuModule, MatTooltipModule, AsyncPipe],
  templateUrl: './filters-compact.component.html',
  styleUrl: './filters-compact.component.css'
})
export class FiltersCompactComponent implements OnInit {
  @Input({ required: true }) fields: Array<FormItemModel>;
  @Output() searchHandler = new EventEmitter<Observable<any>>();
  @ViewChild(FormBaseComponent) protected readonly formBase: FormBaseComponent;
  private readonly outputEventHandler = new BehaviorSubject<any>({});
  private readonly appliedFiltersHandler = new BehaviorSubject<Array<ViewValue>>([]);
  protected appliedFilters$: Observable<Array<ViewValue>>;
  protected controlsMap: Map<string, FormControl> = new Map();

  ngOnInit(): void {
    this.appliedFilters$ = this.appliedFiltersHandler.asObservable();
    this.searchHandler.emit(this.outputEventHandler.asObservable());
  }
  protected handleEvents() {
    this.sendSearchEvent();
  }
  protected sendSearchEvent() {
    const send = this.formBase.buildObjectFromForm();
    this.outputEventHandler.next(send);
  }
  protected updateActiveFilter(name: string) {
    this.fields.forEach(field => field.active = (field.name === name));
  }
  protected getAppliedFilters(): void {
    this.appliedFiltersHandler.next(Array.from(this.formBase.controlsMap.keys())
      .filter(key => {
        const control = this.formBase.controlsMap.get(key);
        return !AppUtil.verifyEmpty(control.value);
      })
      .map(key => {
        const control = this.formBase.controlsMap.get(key);
        const field = this.fields.find(f => f.name === key);
        if (field.type === FormItemModel.TYPE_SELECT) {
          return { value: field.label, viewValue: field.selectOptions.find(o => o.value === control.value).viewValue };
        } else if (field.type === FormItemModel.TYPE_AUTO_COMPLETE) {
          return { value: field.label, viewValue: (control.value as IdValue).value };
        } else {
          return { value: field.label, viewValue: control.value };
        }
      })
    );
  }
  protected setDefaultValues() {
    this.formBase.resetDefaultValues();
  }
}
