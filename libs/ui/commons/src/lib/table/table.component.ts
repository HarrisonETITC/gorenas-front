import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  AppUtil,
  PAGINATOR_SERVICE,
  PaginatorServicePort,
  DestroySubsPort
} from '@gorenas/application-core';
import { distinctUntilChanged, filter, ignoreElements, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { RouterModule } from '@angular/router';
import { IdValue, GeneralModel, StateModel, StateStyle, TableConfig } from '@gorenas/domain';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BtnConfig } from '@gorenas/domain';

@Component({
  selector: 'app-table',
  imports: [CommonModule, PaginatorComponent, RouterModule, MatTableModule, MatIconModule, MatTooltipModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: []
})
export class TableComponent<T extends GeneralModel> implements OnInit, OnDestroy, AfterViewInit, DestroySubsPort {
  @Input({ required: true }) dataNotifier$: Observable<Array<T>>;
  @Input({ required: true }) headersMap: Map<string, string>;
  @Input({ required: true }) generalConfig: TableConfig;
  @Input({ required: false }) statesMap: Map<string, StateStyle>;
  @Input() valuesMap: Map<string, Array<IdValue>>;
  @Output() protected onBtnClick = new EventEmitter<{ event: string, element: T }>();

  protected headers: Array<string>;
  protected rawData: Array<T>;
  protected filteredData: Array<T>;
  protected readonly headersDate = ['created', 'updated'];
  protected readonly headersMoney = ['salary', 'amount', 'price', 'earnings', 'salesAmmounth'];
  protected loadingData = true;

  finishSubs$: Subject<void> = new Subject();

  constructor(
    @Inject(PAGINATOR_SERVICE)
    private readonly paginatorService: PaginatorServicePort<T>,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dataNotifier$.pipe(
      tap((rawData) => {
        if (AppUtil.verifyEmpty(rawData)) {
          this.loadingData = true;
          this.rawData = [];
          this.paginatorService.originalData = [];
        } else {
          this.rawData = rawData;
          this.paginatorService.originalData = this.rawData;
        }
        this.cdr.markForCheck();
      }),
      takeUntil(this.finishSubs$),
      ignoreElements()
    ).subscribe();
  }
  ngOnDestroy(): void {
    this.destroySubs();
  }
  ngAfterViewInit(): void {
    if (AppUtil.verifyEmptySimple(this.statesMap))
      this.statesMap = StateModel.STATES_MAP;

    this.paginatorService.filteredData$
      .pipe(
        filter(data => !AppUtil.verifyEmpty(data)),
        tap((info) => {
          this.filteredData = info;
          this.loadingData = false;
          this.cdr.markForCheck();
        }),
        map(info => {
          const headers = Object.keys(info[0]);
          headers.push('actions');
          return headers;
        }),
        distinctUntilChanged(),
        takeUntil(this.finishSubs$)
      )
      .subscribe((info) => {
        this.headers = info;
        this.cdr.markForCheck();
      });
  }

  destroySubs(): void {
    this.finishSubs$.next();
    this.finishSubs$.complete();
  }

  get info$() {
    return this.paginatorService.originalData$;
  }

  protected getKeys(valor: T) {
    return Object.keys(valor);
  }
  protected transformValue(value: any, key?: string) {
    if (value == 22 || Number(22) == value) {
      //console.log('asd')
    }

    if (this.headersDate.includes(key) && !AppUtil.verifyEmpty(value)) {
      const resultDate = new Date(value);
      return `${resultDate.toLocaleDateString()} ${resultDate.toLocaleTimeString()}`;
    }

    if (!AppUtil.verifyEmpty(key) && this.headersMoney.includes(key))
      return Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);

    if (!AppUtil.verifyEmpty(this.valuesMap) && !AppUtil.verifyEmpty(this.valuesMap.get(key))) {
      const obj = this.valuesMap.get(key).find((r) => r.id == value);
      return obj.value;
    }
    if (!AppUtil.verifyEmpty(this.generalConfig?.columnMappings)) {
      const columnMap = this.generalConfig.columnMappings.get(key);
      if (!AppUtil.verifyEmpty(columnMap)) {
        const mappedValue = columnMap.get(value);
        if (!AppUtil.verifyEmpty(mappedValue)) {
          return mappedValue;
        }
      }
    }

    if (typeof value === 'number') return value;

    return value;
  }
  protected showElement(el: any) {
    console.log(el);
  }
  protected filterActionsRow(headers: Array<string>) {
    return headers.filter(header => header !== 'actions');
  }
  protected hanbleBtnAction(event: string, element: T) {
    this.onBtnClick.emit({ event, element });
  }
  protected verifyEmpty(value: any) {
    return AppUtil.verifyEmpty(value);
  }
  getBtnStyle(btn: BtnConfig): string {
    const basicStyle = btn.style;
    if (!this.verifyEmpty(btn.icon) && !this.verifyEmpty(btn.label))
      return `${basicStyle} px-2 gap-1`;

    return `${basicStyle} justify-center w-8`;
  }
}
