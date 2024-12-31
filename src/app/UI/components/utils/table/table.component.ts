import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Usuario } from '@models/usuario.model';
import { AppUtil } from '@utils/app.util';
import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { Router, RouterModule } from '@angular/router';
import { AuthUtils } from '@utils/auth.util';
import { PAGINATOR_SERVICE } from '@Application/config/providers/utils/utils.providers';
import { PaginatorServicePort } from '@Application/ports/forms/paginator-service.port';
import { ChildUpdatePort } from '@Application/ports/utils/child-update.port';
import { DestroySubsPort } from '@Application/ports/utils/destroy-subs.port';
import { IdValue } from '@Domain/models/general/id-value.interface';

@Component({
  selector: 'app-table',
  imports: [CommonModule, PaginatorComponent, RouterModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableComponent<T extends { id?: number }> implements OnInit, OnDestroy, AfterViewInit, ChildUpdatePort, DestroySubsPort {
  @Input({ required: true }) headersMap: Map<string, string>;
  @Input() valuesMap: Map<string, Array<IdValue>>;
  @Output() protected OnDeactivateBtn = new EventEmitter<T>();
  @Output() protected OnEditBtn = new EventEmitter<T>();

  private readonly filteredInfo = new BehaviorSubject<Array<T>>([]);
  protected headers$: Observable<Array<string>>;
  protected actualPath: string = '';
  protected mapaEstados = Usuario.MAPEOS_ESTADOS;
  protected headersDinero = ['ganancias', 'mes', 'total', 'totales', 'monto'];

  firstLoad = true;
  finishSubs$: Subject<void> = new Subject();

  constructor(
    @Inject(PAGINATOR_SERVICE)
    private readonly paginatorService: PaginatorServicePort<T>,
    private readonly router: Router,
    readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const url = this.router.routerState.snapshot.url;
    this.actualPath = url.split('/').pop();
  }
  ngOnDestroy(): void {
    this.destroySubs();
  }
  ngAfterViewInit(): void {
    this.paginatorService.filteredData$
      .pipe(
        filter(data => !AppUtil.verifyEmpty(data)),
        distinctUntilChanged(),
        tap((info) => {
          this.filteredInfo.next(info);
        }),
        map(info => Object.keys(info[0])),
        distinctUntilChanged(),
        takeUntil(this.finishSubs$)
      )
      .subscribe((info) => {
        this.headers$ = of(info);
        if (this.firstLoad) {
          this.firstLoad = false;
          this.cdr.detectChanges();
        }
      });
  }
  get info$() {
    return this.paginatorService.originalData$;
  }
  get filtered$(): Observable<Array<T>> {
    return this.filteredInfo.asObservable();
  }
  destroySubs(): void {
    this.finishSubs$.next();
    this.finishSubs$.complete();
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
  protected handleDeactivateBtn(register: T) {
    this.OnDeactivateBtn.emit(register);
  }
  protected handleEditBtn(register: T) {
    this.OnEditBtn.emit(register);
  }
  protected canSee(btn: string) {
    return AuthUtils.verificarPuedeVer(`${this.actualPath}-${btn}`)
  }
}
