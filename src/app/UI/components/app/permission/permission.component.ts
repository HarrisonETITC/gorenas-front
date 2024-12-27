import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { PERMISSION_SERVICE } from '@Application/config/providers/permission.providers';
import { ApiServicePort } from '@Application/ports/api-service.port';
import { AuthServicePort } from '@Application/ports/auth-service.port';
import { FiltersCompactComponent } from '@components/utils/filters/filters-compact/filters-compact.component';
import { FiltersExtendedComponent } from '@components/utils/filters/filters-extended/filters-extended.component';
import { TableComponent } from '@components/utils/table/table.component';
import { PermissionModel } from '@Domain/models/base/permission.model';
import { FormItemModel } from '@Domain/models/forms/form-item.model';
import { PermissionModelView } from '@Domain/models/model-view/permission.mv';
import { PermissionFilter } from '@models/filter/permission.filter';
import { AppUtil } from '@utils/app.util';
import { distinctUntilChanged, filter, first, map, Observable, Subject, takeUntil, tap, throttleTime } from 'rxjs';
import { UseTable } from 'src/app/core/interfaces/use-table.interface';
import { MatMenuModule } from '@angular/material/menu';
import { FIELDS_SERVICE, FORM_DATA_SERVICE } from '@Application/config/providers/form.providers';
import { FieldsServicePort } from '@Application/ports/forms/fields-service.port';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormDataServicePort } from '@Application/ports/forms/form-data-service.port';
import { PermissionForms } from '@Application/config/forms/permissions/permission.forms';
import { ROLE_SERVICE } from '@Application/config/providers/role.providers';
import { RoleModel } from '@Domain/models/base/role.model';
import { RoleModelView } from '@Domain/models/model-view/role.mv';

@Component({
  selector: 'app-permission',
  imports: [CommonModule, TableComponent, FiltersExtendedComponent, MatIconModule, FiltersCompactComponent, MatSlideToggleModule, MatButtonModule, MatMenuModule, RouterOutlet, AsyncPipe],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent implements OnInit, OnDestroy, UseTable<PermissionModelView> {
  data$: Observable<Array<PermissionModelView>>;
  cols$: Observable<string[]>;
  headers: Map<string, string>;
  filterFields: Array<FormItemModel>;
  protected filterType: boolean = false;
  protected isFormView$: Observable<boolean>;
  private readonly finsihSubs$ = new Subject<void>();

  constructor(
    @Inject(PERMISSION_SERVICE)
    private readonly service: ApiServicePort<PermissionModel, PermissionModelView>,
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    @Inject(FIELDS_SERVICE)
    private readonly fieldsService: FieldsServicePort,
    @Inject(FORM_DATA_SERVICE)
    private readonly formDataService: FormDataServicePort,
    @Inject(ROLE_SERVICE)
    private readonly roleService: ApiServicePort<RoleModel, RoleModelView>,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initData();
    this.initForms();

    this.headers = PermissionModelView.headers;
  }
  ngOnDestroy(): void {
    this.finsihSubs$.next();
    this.finsihSubs$.complete();
    this.fieldsService.resetControls();
  }
  initData(): void {
    this.authService.getUser()
      .pipe(
        filter(user => !AppUtil.verifyEmpty(user) && !AppUtil.verifyEmpty(user.role)),
        first(),
        takeUntil(this.finsihSubs$),
        tap(user => {
          this.search({ roleName: user.role, module: null, permission: null });
          this.initFilters(user.role);
        })
      )
      .subscribe();
    this.cols$ = this.data$.pipe(
      map(perm => { return perm.length > 0 ? Object.keys(perm[0]) : [] })
    );
  }
  initFilters(roleName: string): void {
    this.filterFields = PermissionFilter.FIELDS;
    PermissionFilter.FIELDS.find(f => f.name === 'roleName').defaultValue = roleName
  }
  initForms(): void {
    this.isFormView$ = this.formDataService.isFormActive();
    const initForm = this.router.url.includes('form');

    if (initForm) {
      this.formDataService.updateState(true);
      this.goCreate();
    }
  }
  search(filterP?: PermissionFilter): void {
    this.data$ = this.service.getCanSee(filterP).pipe(
      filter(f => !AppUtil.verifyEmpty(f)),
      distinctUntilChanged()
    );
  }
  handleSearch(event: Observable<PermissionFilter>) {
    event.pipe(
      filter(f => !AppUtil.verifyEmpty(f)),
      distinctUntilChanged(),
      throttleTime(500, undefined, { leading: true, trailing: true }),
      takeUntil(this.finsihSubs$)
    ).subscribe(filter => this.search(filter));
  }
  private goForm(edit: boolean = false, id?: number) {
    const createForm = PermissionForms.CREATE_FORM;
    createForm.dataInitializer = this.service;
    createForm.fields.find(f => f.name === 'role').completeOptionsFilter = this.roleService;

    const formRoute = (edit && !AppUtil.verifyEmpty(id)) ? `form/${id}` : `form`;
    this.formDataService.updateState(true);
    this.formDataService.sendComponentEvent({ event: '' });
    this.formDataService.setForms([PermissionForms.CREATE_FORM]);

    const formSub = this.formDataService.getFormEvent().pipe(
      filter(ev => ev.event === 'create' || ev.event === 'update' || ev.event === 'close'),
      takeUntil(this.finsihSubs$)
    ).subscribe((ev) => {
      if (ev.event === 'create' || ev.event === 'update')
        this.formDataService.sendComponentEvent({ event: 'done' })
      if (ev.event === 'close')
        formSub.unsubscribe();
    })

    this.router.navigate([formRoute], { relativeTo: this.route });
  }
  goCreate(): void {
    this.goForm();
  }
  goUpdate(id: string | number): void {
    this.goForm(true, +id);
  }
}
