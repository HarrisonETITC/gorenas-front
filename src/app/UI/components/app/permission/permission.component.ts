import { Component, Inject, OnInit } from '@angular/core';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { PERMISSION_SERVICE } from '@Application/config/providers/permission.providers';
import { ApiServicePort } from '@Application/ports/api-service.port';
import { AuthServicePort } from '@Application/ports/auth-service.port';
import { PermissionModel } from '@Domain/models/base/permission.model';
import { FormItemModel } from '@Domain/models/forms/form-item.model';
import { PermissionModelView } from '@Domain/models/model-view/permission.mv';
import { PermissionFilter } from '@models/filter/permission.filter';
import { AppUtil } from '@utils/app.util';
import { filter, map, Observable, take, tap } from 'rxjs';
import { UseTable } from 'src/app/core/interfaces/use-table.interface';
import { PermissionForms } from '@Application/config/forms/permissions/permission.forms';
import { ROLE_SERVICE } from '@Application/config/providers/role.providers';
import { RoleModel } from '@Domain/models/base/role.model';
import { RoleModelView } from '@Domain/models/model-view/role.mv';
import { AppModel } from '@Domain/models/base/application.model';
import { BaseDataComponent } from '@components/base/base-data/base-data.component';
import { FormDataConfig } from '@Domain/models/forms/form-data-config.model';

@Component({
  selector: 'app-permission',
  imports: [BaseDataComponent],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent implements OnInit, UseTable<PermissionModelView> {
  protected readonly moduleName = AppModel.MODULE_PERMISSIONS;
  data$: Observable<Array<PermissionModelView>>;
  cols$: Observable<string[]>;
  headers: Map<string, string>;
  filterFields: Array<FormItemModel>;
  protected filterExtended: boolean = false;
  protected isFormView$: Observable<boolean>;

  constructor(
    @Inject(PERMISSION_SERVICE)
    protected readonly service: ApiServicePort<PermissionModel, PermissionModelView>,
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    @Inject(ROLE_SERVICE)
    private readonly roleService: ApiServicePort<RoleModel, RoleModelView>,
  ) {
  }

  ngOnInit(): void {
    this.headers = PermissionModelView.headers;
  }
  getInitFilter(): Observable<PermissionFilter> {
    return this.authService.getUser().pipe(
      filter(user => !AppUtil.verifyEmpty(user) && !AppUtil.verifyEmpty(user.role)),
      take(1),
      tap(user => this.initFilters(user.role)),
      map(user => {
        return { roleName: user.role, module: null, permission: null };
      })
    );
  }
  getForms(): Array<FormDataConfig> {
    const createForm = PermissionForms.CREATE_FORM;
    createForm.dataInitializer = this.service;
    createForm.fields.find(f => f.name === 'role').completeOptionsFilter = this.roleService;

    return [createForm];
  }
  initFilters(roleName: string): void {
    this.filterFields = PermissionFilter.FIELDS;
    PermissionFilter.FIELDS.find(f => f.name === 'roleName').defaultValue = roleName
  }
}
