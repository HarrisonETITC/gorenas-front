import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AppUtil } from '@utils/app.util';
import { distinctUntilChanged, filter, ignoreElements, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { RouterModule } from '@angular/router';
import { PAGINATOR_SERVICE } from '@Application/config/providers/utils/utils.providers';
import { PaginatorServicePort } from '@Application/ports/forms/paginator-service.port';
import { DestroySubsPort } from '@Application/ports/utils/destroy-subs.port';
import { IdValue } from '@Domain/models/general/id-value.interface';
import { MatTableModule } from '@angular/material/table';
import { GeneralModel } from '@Domain/models/general/general.model';
import { StateModel } from '@Domain/models/general/state.model';
import { StateStyle } from '@Domain/types/state-style.type';
import { TableConfig } from '@Domain/models/general/table-config.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BtnConfig } from '@Domain/models/general/btn.config';

@Component({
  selector: 'app-table',
  imports: [CommonModule, PaginatorComponent, RouterModule, MatTableModule, MatIconModule, MatTooltipModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
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
  protected headersDinero = ['ganancias', 'mes', 'total', 'totales', 'monto'];
  protected loadingData = true;

  finishSubs$: Subject<void> = new Subject();

  constructor(
    @Inject(PAGINATOR_SERVICE)
    private readonly paginatorService: PaginatorServicePort<T>
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
    const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d+)?(Z|[+-][01]\d:[0-5]\d)?$/;

    if (datePattern.test(value)) {
      const resultDate = new Date(value);
      return `${resultDate.toLocaleDateString()} ${resultDate.toLocaleTimeString()}`;
    }

    if (!AppUtil.verifyEmpty(key) && this.headersDinero.includes(key)) {
      return Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    }

    if (!AppUtil.verifyEmpty(this.valuesMap) && !AppUtil.verifyEmpty(this.valuesMap.get(key))) {
      const obj = this.valuesMap.get(key).find((r) => r.id = value);
      return obj.value;
    }

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
