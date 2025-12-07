import { CommonModule, AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  GeneralModel,
  TableConfig,
  ViewValue,
  GeneralFilter
} from '@gorenas/domain';
import {
  AppUtil,
  ApiServicePort,
  FORM_DATA_SERVICE,
  AuthServicePort,
  FormBaseServicePort,
  FormDataServicePort,
  DestroySubsPort,
  AUTH_SERVICE,
  FIELDS_SERVICE,
  UseTable,
  BaseDataConfig,
  NOTIFICATION_SERVICE,
  NotificationServicePort,
  SuccessConfig
} from '@gorenas/application-core';
import { FormsProviders } from '@gorenas/data-access-forms';
import { UtilsProviders } from '@gorenas/data-access-commons';
import {
  FormDataConfig,
  FormItemModel,
  PermissionFilter
} from '@gorenas/shared-util-forms';
import {
  FiltersCompactComponent,
  FiltersExtendedComponent
} from '@gorenas/ui-forms';
import {
  BehaviorSubject,
  defaultIfEmpty,
  distinctUntilChanged,
  filter,
  ignoreElements,
  Observable,
  skip,
  Subject,
  take,
  takeUntil,
  tap,
  throttleTime
} from 'rxjs';
import { TableComponent } from '../table/table.component';

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
  // Acciones base que puede manejar BaseDataComponent de forma genérica
  public static readonly BASE_ACTIONS = {
    EDIT: 'edit',
    CREATE: 'create',
    VIEW: 'view'
  } as const;

  // Acciones que requieren formularios y pueden ser manejadas genéricamente
  private static readonly FORM_ACTIONS = new Set([
    BaseDataComponent.BASE_ACTIONS.EDIT,
    BaseDataComponent.BASE_ACTIONS.CREATE
  ]);

  @Input({ required: true }) pageConfig: BaseDataConfig;
  @Input({ required: true }) module: string;
  @Input({ required: true }) service: ApiServicePort<T, U>;
  @Input({ required: true }) headers: Map<string, string>;
  @Input({ required: true }) initFilter$: Observable<GeneralFilter>;
  @Input({ required: true }) tableConfig: TableConfig;
  @Input({ required: false }) infoMaps?: Map<string, Array<ViewValue>>;
  @Input({ required: false }) filters?: Array<FormItemModel>;
  @Input({ required: false }) dataForms?: Array<FormDataConfig>;
  @Input({ required: false }) actionHandlers?: Map<string, (element: T) => void>;
  @Input({ required: false }) enableDefaultActions: boolean = true;

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
    private readonly fieldsService: FormBaseServicePort,
    @Inject(FORM_DATA_SERVICE)
    private readonly formDataService: FormDataServicePort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationServicePort,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    readonly cdr: ChangeDetectorRef
  ) { 
    this.initDefaultActionHandlers();
  }

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

    // Si no hay filtros configurados, cargar datos inmediatamente
    if (AppUtil.verifyEmpty(this.filters)) {
      this.search(this.initFilterRaw);
    }

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
          // Ejecutar fuera del ciclo de detección de cambios
          setTimeout(() => {
            this.search(this.initFilterRaw);
            this.fieldsService.sendFiltersEvent();
          }, 0);
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
  protected handleSearch(event: Observable<GeneralFilter>) {
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
    this.notifyForms(edit);

    this.router.navigate([formRoute], { relativeTo: this.route });
  }
  private notifyForms(isEdit: boolean = false) {
    // Limpiar controles antes de abrir el formulario para evitar valores residuales
    if (!isEdit) {
      this.fieldsService.resetControls();
    }
    
    this.dataForms.forEach((config, index) => {
      const defValues = this.formsDefsValues.get(index);
      
      // Solo restaurar valores por defecto si no es edición
      if (!isEdit) {
        config.fields = config.fields.map((field, fieldIndex) => {
          // Preservar la instancia original y solo actualizar el defaultValue
          // Esto mantiene las referencias a autocompleteOptions/selectOptions/options
          field.defaultValue = defValues[fieldIndex];
          return field;
        });
      }
      
      // Asegurar que el dataInitializer esté configurado para edición
      if (isEdit && !config.dataInitializer) {
        config.dataInitializer = this.service;
      }
    });
    this.formDataService.updateState(true);
    this.formDataService.sendComponentEvent({ event: '' });
    this.formDataService.setForms(this.dataForms);

    const formSub = this.formDataService.getFormEvent().pipe(
      filter(ev => ev.event === 'create' || ev.event === 'update' || ev.event === 'close'),
      takeUntil(this.finishSubs$)
    ).subscribe((ev) => {
      if (ev.event === 'create') {
        this.handleCreateSubmit();
      } else if (ev.event === 'update') {
        this.handleUpdateSubmit(ev.id);
      } else if (ev.event === 'close') {
        formSub.unsubscribe();
      }
    });
  }

  /**
   * Maneja el envío del formulario de creación
   */
  private handleCreateSubmit(): void {
    const formData = this.fieldsService.getObject() as T;
    console.log('[BaseData] Creando:', formData);
    
    this.service.create(formData).pipe(
      take(1)
    ).subscribe({
      next: (result) => {
        console.log('[BaseData] Creado exitosamente:', result);
        this.notificationService.showNotification(SuccessConfig('Registro creado', 'El registro se ha creado exitosamente'));
        this.formDataService.sendComponentEvent({ event: 'done' });
      },
      error: (err) => {
        console.error('[BaseData] Error al crear:', err);
        this.formDataService.sendComponentEvent({ event: 'error', message: err?.message || 'Error al crear' });
      }
    });
  }

  /**
   * Maneja el envío del formulario de actualización
   */
  private handleUpdateSubmit(id?: number): void {
    const formData = this.fieldsService.getObject() as T;
    // Agregar el id al objeto para la actualización
    if (id !== undefined) {
      (formData as any).id = id;
    }
    console.log('[BaseData] Actualizando:', formData);
    
    this.service.modify(formData).pipe(
      take(1)
    ).subscribe({
      next: (result) => {
        console.log('[BaseData] Actualizado exitosamente:', result);
        this.notificationService.showNotification(SuccessConfig('Registro actualizado', 'El registro se ha actualizado exitosamente'));
        this.formDataService.sendComponentEvent({ event: 'done' });
      },
      error: (err) => {
        console.error('[BaseData] Error al actualizar:', err);
        this.formDataService.sendComponentEvent({ event: 'error', message: err?.message || 'Error al actualizar' });
      }
    });
  }
  protected handleBtnAction(ev: { event: string, element: T }): void {
    // 1. Primero verificar si hay un handler personalizado
    const customHandler = this.actionHandlers?.get(ev.event);
    if (customHandler) {
      customHandler(ev.element);
      return;
    }

    // 2. Si no hay handler personalizado, verificar si es una acción base que podemos manejar
    if (this.enableDefaultActions && this.canHandleBaseAction(ev.event)) {
      this.handleBaseAction(ev.event, ev.element);
      return;
    }

    // 3. Si llegamos aquí, no hay handler para esta acción
    console.warn(`No handler found for action: ${ev.event}`);
  }

  private canHandleBaseAction(action: string): boolean {
    return Object.values(BaseDataComponent.BASE_ACTIONS).includes(action as any);
  }

  private handleBaseAction(action: string, element: T): void {
    switch (action) {
      case BaseDataComponent.BASE_ACTIONS.EDIT:
        this.handleEditAction(element);
        break;
      case BaseDataComponent.BASE_ACTIONS.CREATE:
        this.handleCreateAction();
        break;
      case BaseDataComponent.BASE_ACTIONS.VIEW:
        this.handleViewAction(element);
        break;
      default:
        console.warn(`Base action ${action} is not implemented`);
    }
  }

  private handleEditAction(element: T): void {
    if (!this.hasFormCapability()) {
      console.warn('Edit action requires dataForms to be configured');
      return;
    }
    this.goUpdate(element.id);
  }

  private handleCreateAction(): void {
    if (!this.hasFormCapability()) {
      console.warn('Create action requires dataForms to be configured');
      return;
    }
    this.goCreate();
  }

  private handleViewAction(element: T): void {
    // Por defecto, view es lo mismo que edit pero en modo solo lectura
    // Los features pueden sobrescribir esto con su propio handler
    console.log('View action - implement custom handler for specific behavior', element);
  }

  private hasFormCapability(): boolean {
    return !AppUtil.verifyEmpty(this.dataForms);
  }

  private initDefaultActionHandlers(): void {
    // Este método ahora solo inicializa el Map si no existe
    // Las acciones base se manejan en handleBaseAction()
    if (!this.actionHandlers) {
      this.actionHandlers = new Map();
    }
  }

  protected verifyEmpty(data: any): boolean {
    return AppUtil.verifyEmpty(data);
  }
}
