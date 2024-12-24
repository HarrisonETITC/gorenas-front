import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { PERMISSION_SERVICE } from '@Application/config/providers/permission.providers';
import { PERSON_SERVICE } from '@Application/config/providers/person.providers';
import { ApiServicePort } from '@Application/ports/api-service.port';
import { AuthServicePort } from '@Application/ports/auth-service.port';
import { FiltersCompactComponent } from '@components/utils/filters/filters-compact/filters-compact.component';
import { FiltersExtendedComponent } from '@components/utils/filters/filters-extended/filters-extended.component';
import { TableComponent } from '@components/utils/table/table.component';
import { PermissionModel } from '@Domain/models/base/permission.model';
import { PersonModel } from '@Domain/models/base/person.model';
import { RoleModel } from '@Domain/models/base/role.model';
import { FormItemModel } from '@Domain/models/form-item.model';
import { PermissionModelView } from '@Domain/models/model-view/permission.mv';
import { PersonModelView } from '@Domain/models/model-view/person.mv';
import { PermissionFilter } from '@models/filter/permission.filter';
import { AppUtil } from '@utils/app.util';
import { concatMap, distinctUntilChanged, filter, map, Observable, Subscription, take, throttleTime } from 'rxjs';
import { UseTable } from 'src/app/core/interfaces/use-table.interface';

@Component({
  selector: 'app-permission',
  imports: [CommonModule, TableComponent, FiltersExtendedComponent, MatIconModule, FiltersCompactComponent],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent implements OnInit, OnDestroy, UseTable<PermissionModelView> {
  data$: Observable<Array<PermissionModelView>>;
  cols$: Observable<string[]>;
  headers: Map<string, string>;
  subs: Array<Subscription> = [];
  filterFields: Array<FormItemModel>;
  persons$;

  constructor(
    @Inject(PERMISSION_SERVICE)
    private readonly service: ApiServicePort<PermissionModel, PermissionModelView>,
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    @Inject(PERSON_SERVICE)
    private readonly personService: ApiServicePort<PersonModel, PersonModelView>
  ) { }

  ngOnInit(): void {
    this.initFilters();
    const dataSub = this.authService.getUser()
      .pipe(
        filter(user => !AppUtil.verifyEmpty(user) && !AppUtil.verifyEmpty(user.role)),
        take(1)
      )
      .subscribe(user => {
        if (!AppUtil.verifyEmpty(user) && !AppUtil.verifyEmpty(user.role)) {
          this.initData()
        }
      });
    this.subs.push(dataSub);
    this.headers = PermissionModelView.headers;
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => {
      if (!s.closed)
        s.unsubscribe();
    })
  }

  initData(filter?: PermissionFilter): void {
    this.search(filter);
    this.cols$ = this.data$.pipe(
      map(perm => { return perm.length > 0 ? Object.keys(perm[0]) : [] })
    );
  }

  search(filterP?: PermissionFilter): void {
    this.data$ = this.service.getCanSee(filterP).pipe(
      filter(f => !AppUtil.verifyEmpty(f)),
      distinctUntilChanged()
    );
  }

  initFilters(): void {
    this.filterFields = [
      {
        label: 'Nombre del rol',
        name: 'roleName',
        icon: 'tune_outline',
        type: FormItemModel.TYPE_SELECT,
        defaultValue: RoleModel.ROLE_ADMINISTRATOR,
        selectOptions: Array.from(RoleModel.ROLES_NAMES.keys()).map(key => { return { value: key, viewValue: RoleModel.ROLES_NAMES.get(key) } }),
        active: true
      },
      {
        label: 'Nombre del módulo',
        name: 'module',
        icon: 'view_module_outline',
        type: FormItemModel.TYPE_SELECT,
        defaultValue: '',
        selectOptions: [{ value: '', viewValue: 'Todos' }].concat(PermissionModel.MODULES.map(mod => { return { value: mod, viewValue: mod } }))
      },
      {
        label: 'Nombre del permiso',
        name: 'permission',
        icon: 'article_outline',
        type: FormItemModel.TYPE_TEXT,
        defaultValue: ''
      }
    ];
  }

  updateAutocomplete(handler: { name: string, updater: Observable<string> }) {
    const field = this.filterFields.find(f => f.name === handler.name);
    field.completeOptions = handler.updater.pipe(
      distinctUntilChanged(),
      throttleTime(300, undefined, { leading: true, trailing: true }),
      concatMap(val => field.completeOptionsFilter.getAvailable(val))
    );
  }

  handleSearch(event: Observable<PermissionFilter>) {
    this.subs.push(event.pipe(
      distinctUntilChanged(),
      throttleTime(500, undefined, { leading: true, trailing: true }),
    ).subscribe(filter => this.search(filter)));
  }
}
