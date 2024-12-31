import { CommonModule, AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { FIELDS_SERVICE, FORM_DATA_SERVICE, FormsProviders } from '@Application/config/providers/form.providers';
import { PAGINATOR_SERVICE, UtilsProviders } from '@Application/config/providers/utils/utils.providers';
import { ApiServicePort } from '@Application/ports/api-service.port';
import { AuthServicePort } from '@Application/ports/auth-service.port';
import { FieldsServicePort } from '@Application/ports/forms/fields-service.port';
import { FormDataServicePort } from '@Application/ports/forms/form-data-service.port';
import { PaginatorServicePort } from '@Application/ports/forms/paginator-service.port';
import { ChildUpdatePort } from '@Application/ports/utils/child-update.port';
import { DestroySubsPort } from '@Application/ports/utils/destroy-subs.port';
import { FiltersCompactComponent } from '@components/utils/filters/filters-compact/filters-compact.component';
import { FiltersExtendedComponent } from '@components/utils/filters/filters-extended/filters-extended.component';
import { TableComponent } from '@components/utils/table/table.component';
import { FormDataConfig } from '@Domain/models/forms/form-data-config.model';
import { FormItemModel } from '@Domain/models/forms/items/form-item.model';
import { ViewValue } from '@Domain/types/view-value.type';
import { GeneralFilter } from '@models/base/general.filter';
import { PermissionFilter } from '@models/filter/permission.filter';
import { AppUtil } from '@utils/app.util';
import { BehaviorSubject, defaultIfEmpty, distinctUntilChanged, filter, ignoreElements, Observable, Subject, take, takeUntil, tap, throttleTime } from 'rxjs';
import { UseTable } from 'src/app/core/interfaces/use-table.interface';

@Component({
  selector: 'app-base-data',
  imports: [CommonModule, TableComponent, FiltersExtendedComponent, MatIconModule, FiltersCompactComponent, MatSlideToggleModule, MatButtonModule, MatMenuModule, RouterOutlet, AsyncPipe],
  templateUrl: './base-data.component.html',
  styleUrl: './base-data.component.css',
  providers: [
    ...UtilsProviders,
    ...FormsProviders
  ]
})
export class BaseDataComponent<T, U = T> implements OnInit, OnDestroy, UseTable<U>, DestroySubsPort, ChildUpdatePort {
  @Input({ required: true }) module: string;
  @Input({ required: true }) service: ApiServicePort<T, U>;
  @Input({ required: true }) headers: Map<string, string>;
  @Input({ required: true }) initFilter$: Observable<GeneralFilter>;
  @Input({ required: false }) infoMaps?: Map<string, Array<ViewValue>>;
  @Input({ required: false }) filters?: Array<FormItemModel>;
  @Input({ required: false }) dataForms?: Array<FormDataConfig>;

  protected filterExtended: boolean = false;
  protected isFormView$: Observable<boolean>;
  private readonly dataManager = new BehaviorSubject<Array<U>>([]);
  protected initialSearch = true;

  readonly finishSubs$ = new Subject<void>();
  readonly firstLoad: boolean;

  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    @Inject(FIELDS_SERVICE)
    private readonly fieldsService: FieldsServicePort,
    @Inject(FORM_DATA_SERVICE)
    private readonly formDataService: FormDataServicePort,
    @Inject(PAGINATOR_SERVICE)
    private readonly paginatorService: PaginatorServicePort<T>,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initData();
    this.initForms();
  }
  ngOnDestroy(): void {
    this.fieldsService.flushService();
    this.destroySubs();
  }

  destroySubs(): void {
    this.finishSubs$.next();
    this.finishSubs$.complete();
    this.fieldsService.resetControls();
  }

  get data$(): Observable<Array<U>> {
    return this.dataManager.asObservable();
  }

  protected initData() {
    this.initFilter$.pipe(
      take(1),
      tap(filter => this.search(filter)),
      ignoreElements()
    ).subscribe();

    this.isFormView$ = this.formDataService.isFormActive().pipe(
      distinctUntilChanged(),
      tap(value => {
        if (!this.initialSearch && !value) {
          this.initialSearch = true;
          this.paginatorService.sendChangeEvent('detect');
          this.fieldsService.sendCleanFilters();
        }
      })
    );
  }
  protected initForms(): void {
    const initForm = this.router.url.includes('form');

    if (initForm) {
      this.notifyForms();
    }
  }
  protected goCreate(): void {
    this.goForm();
  }
  protected goUpdate(id: string | number): void {
    this.goForm(true, +id);
  }
  protected handleSearch(event: Observable<PermissionFilter>) {
    event.pipe(
      filter(f => {
        return !AppUtil.verifyEmptySimple(f)
      }),
      distinctUntilChanged(),
      throttleTime(500, undefined, { leading: true, trailing: true }),
      takeUntil(this.finishSubs$)
    ).subscribe(filter => {
      if (this.initialSearch)
        this.initialSearch = false;
      else
        this.search(filter)
    });
  }
  private search(dataFilter?: GeneralFilter): void {
    this.service.getCanSee(dataFilter).pipe(
      defaultIfEmpty([]),
      distinctUntilChanged(),
      tap(data => {
        this.paginatorService.originalData = (data as T[]);
      })
    ).subscribe();
  }
  private goForm(edit: boolean = false, id?: number) {
    const formRoute = (edit && !AppUtil.verifyEmpty(id)) ? `form/${id}` : `form`;
    this.notifyForms();

    this.router.navigate([formRoute], { relativeTo: this.route });
  }
  private notifyForms() {
    this.formDataService.updateState(true);
    this.formDataService.sendComponentEvent({ event: '' });
    this.formDataService.setForms(this.dataForms);

    const formSub = this.formDataService.getFormEvent().pipe(
      filter(ev => ev.event === 'create' || ev.event === 'update' || ev.event === 'close'),
      takeUntil(this.finishSubs$)
    ).subscribe((ev) => {
      if (ev.event === 'create' || ev.event === 'update')
        this.formDataService.sendComponentEvent({ event: 'done' })
      if (ev.event === 'close')
        formSub.unsubscribe();
    });
  }
  protected verifyEmpty(data: any): boolean {
    return AppUtil.verifyEmpty(data);
  }
}
