import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBaseComponent } from '@gorenas/ui-controls';
import { FormItemModel } from '@gorenas/shared-util-forms';
import { BehaviorSubject, filter, Observable, tap } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IdValue } from '@gorenas/domain';
import { ViewValue } from '@gorenas/domain';
import {  } from '@gorenas/application-core';
import { AsyncPipe } from '@angular/common';
import { ChildUpdatePort, FIELDS_SERVICE, FieldsServicePort, AppUtil } from '@gorenas/application-core';

@Component({
  selector: 'app-filters-compact',
  imports: [FormBaseComponent, MatMenuModule, MatTooltipModule, AsyncPipe],
  templateUrl: './filters-compact.component.html',
  styleUrl: './filters-compact.component.css'
})
export class FiltersCompactComponent implements OnInit, ChildUpdatePort {
  @Input({ required: true }) fields: Array<FormItemModel>;
  @Output() searchHandler = new EventEmitter<Observable<any>>();
  @ViewChild(FormBaseComponent) protected readonly formBase: FormBaseComponent;
  private readonly outputEventHandler = new BehaviorSubject<any>({});
  private readonly appliedFiltersHandler = new BehaviorSubject<Array<ViewValue>>([]);
  protected appliedFilters$: Observable<Array<ViewValue>>;
  protected controlsMap: Map<string, FormControl> = new Map();
  protected procesedFields: Array<FormItemModel> = [];
  firstLoad: boolean = true;

  constructor(
    @Inject(FIELDS_SERVICE)
    private readonly fieldsService: FieldsServicePort,
    readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.appliedFilters$ = this.appliedFiltersHandler.asObservable();
    this.searchHandler.emit(this.outputEventHandler.asObservable());

    this.fieldsService.getFields().pipe(
      filter(fields => !AppUtil.verifyEmpty(fields)),
      tap(fields => {
        this.procesedFields = fields;
        if (this.firstLoad) {
          this.firstLoad = false;
          this.cdr.detectChanges();
        }
      })
    ).subscribe();
  }
  protected handleEvents() {
    this.sendSearchEvent();
  }
  protected sendSearchEvent() {
    const send = this.fieldsService.getObject();
    this.outputEventHandler.next(send);
  }
  protected updateActiveFilter(name: string) {
    this.procesedFields.forEach(field => field.active = (field.name === name));
  }
  protected getAppliedFilters(): void {
    this.appliedFiltersHandler.next(Array.from(this.formBase.controlsMap.keys())
      .filter(key => {
        const control = this.formBase.controlsMap.get(key);
        return !AppUtil.verifyEmpty(control.value);
      })
      .map(key => {
        const control = this.formBase.controlsMap.get(key);
        const field = this.procesedFields.find(f => f.name === key);
        if (field.type === FormItemModel.TYPE_SELECT) {
          return new ViewValue(field.label, field.selectOptions.options.find(o => o.value === control.value).viewValue);
        } else if (field.type === FormItemModel.TYPE_AUTO_COMPLETE) {
          return new ViewValue(field.label, (control.value as IdValue).value);
        } else {
          return new ViewValue(field.label, control.value);
        }
      })
    );
  }
  protected setDefaultValues() {
    this.fieldsService.sendFiltersEvent();
  }
}
