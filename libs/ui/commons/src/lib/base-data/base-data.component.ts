import { CommonModule, AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FIELDS_SERVICE, FORM_DATA_SERVICE } from '@gorenas/data-access-forms';
import { FormsProviders } from '@gorenas/data-access-forms';
import { UtilsProviders } from '@gorenas/data-access-commons';
import { ApiServicePort } from '@gorenas/application-core';
import { AuthServicePort } from '@gorenas/application-core';
import { FieldsServicePort } from '@gorenas/application-core';
import { FormDataServicePort } from '@gorenas/application-core';
import { DestroySubsPort } from '@gorenas/application-core';
import { FiltersCompactComponent } from '@gorenas/ui-forms';
import { FiltersExtendedComponent } from '@gorenas/ui-forms';
import { TableComponent } from '@gorenas/ui-commons';
import { FormDataConfig } from '@gorenas/shared-util-forms';
import { FormItemModel } from '@gorenas/shared-util-forms';
import { GeneralModel } from '@gorenas/domain';
import { TableConfig } from '@gorenas/domain';
import { ViewValue } from '@gorenas/domain';
import { GeneralFilter } from '@gorenas/domain';
import { PermissionFilter } from '@gorenas/shared-util-forms';
import { AppUtil } from '@gorenas/application-core';
import { BehaviorSubject, defaultIfEmpty, distinctUntilChanged, filter, ignoreElements, Observable, skip, Subject, take, takeUntil, tap, throttleTime } from 'rxjs';
import { UseTable } from '@gorenas/application-core';
import { AUTH_SERVICE } from '@gorenas/data-access-core';

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
export class BaseDataComponent<T extends GeneralModel, U = T> implements OnInit, OnDestroy, UseTable<U>, DestroySubsPort {
  @Input({ required: true }) pageName: string;
  @Input({ required: true }) module: string;
  @Input({ required: true }) service: ApiServicePort<T, U>;
  @Input({ required: true }) headers: Map<string, string>;
  @Input({ required: true }) initFilter$: Observable<GeneralFilter>;
  @Input({ required: true }) tableConfig: TableConfig;
  @Input({ required: false }) infoMaps?: Map<string, Array<ViewValue>>;
  @Input({ required: false }) filters?: Array<FormItemModel>;
  @Input({ required: false }) dataForms?: Array<FormDataConfig>;

  private readonly formsDefsValues: Map<number, Array<any>> = new Map();
  protected readonly dataManager: BehaviorSubject<Array<T>> = new BehaviorSubject(null);
  protected filterExtended: boolean = false;
  protected isFormView$: Observable<boolean>;
  protected initFilterRaw: GeneralFilter;
  protected showFilters: boolean = false;

  readonly finishSubs$ = new Subject<void>();

  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    @Inject(FIELDS_SERVICE)
    private readonly fieldsService: FieldsServicePort,
    @Inject(FORM_DATA_SERVICE)
    private readonly formDataService: FormDataServicePort,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!AppUtil.verifyEmpty(this.dataForms) && this.formsDefsValues.size === 0) {
      this.dataForms.forEach((config, index) => {
        this.formsDefsValues.set(index, config.fields.map(field => field.defaultValue));
      });
    }

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
  }

  get data$(): Observable<Array<T>> {
    return this.dataManager.asObservable();
  }

  protected initData() {
    this.initFilter$.pipe(
      take(1),
      tap(filter => {
        this.initFilterRaw = filter;
        this.fieldsService.sendFiltersEvent();
      }),
      ignoreElements()
    ).subscribe();

    this.fieldsService.getFields().pipe(
      filter(fields => !AppUtil.verifyEmpty(fields)),
      take(1),
      tap(_ => this.showFilters = true),
      ignoreElements()
    ).subscribe();

    this.isFormView$ = this.formDataService.isFormActive().pipe(
      filter(active => !AppUtil.verifyEmptySimple(active)),
      distinctUntilChanged(),
      takeUntil(this.finishSubs$),
      tap(value => {
        if (!value) {
          this.dataManager.next([]);
          this.fieldsService.sendFiltersEvent();
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
      skip(1),
      distinctUntilChanged(),
      throttleTime(500, undefined, { leading: true, trailing: true }),
      takeUntil(this.finishSubs$)
    ).subscribe(filter => {
      this.search(filter)
    });
  }
  private search(dataFilter?: GeneralFilter): void {
    this.service.getCanSee(dataFilter).pipe(
      defaultIfEmpty([]),
      distinctUntilChanged(),
      tap((data: Array<T>) => {
        this.dataManager.next(data)
      })
    ).subscribe();
  }
  private goForm(edit: boolean = false, id?: number) {
    const formRoute = (edit && !AppUtil.verifyEmpty(id)) ? `form/${id}` : `form`;
    this.notifyForms();

    this.router.navigate([formRoute], { relativeTo: this.route });
  }
  private notifyForms() {
    this.dataForms.forEach((config, index) => {
      const defValues = this.formsDefsValues.get(index);
      config.fields = config.fields.map((field, fieldIndex) => ({
        ...field,
        defaultValue: defValues[fieldIndex]
      }));
    });
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
  protected handleBtnAction(ev: { event: string, element: T }): void {
    if (ev.event === 'edit')
      this.goUpdate(ev.element.id);
  }
  protected verifyEmpty(data: any): boolean {
    return AppUtil.verifyEmpty(data);
  }
}
