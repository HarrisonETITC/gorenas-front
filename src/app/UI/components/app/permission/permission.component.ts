import { Component, Inject, OnInit } from '@angular/core';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { PERMISSION_SERVICE } from '@Application/config/providers/permission.providers';
import { ApiServicePort } from '@Application/ports/api-service.port';
import { AuthServicePort } from '@Application/ports/auth-service.port';
import { PermissionModel } from '@Domain/models/base/permission.model';
import { FormItemModel } from '@Domain/models/forms/items/form-item.model';
import { PermissionModelView } from '@Domain/models/model-view/permission.mv';
import { PermissionFilter } from '@models/filter/permission.filter';
import { AppUtil } from '@utils/app.util';
import { filter, map, Observable, take, tap } from 'rxjs';
import { PermissionForms } from '@Application/config/forms/permissions/permission.forms';
import { ROLE_SERVICE } from '@Application/config/providers/role.providers';
import { RoleModel } from '@Domain/models/base/role.model';
import { RoleModelView } from '@Domain/models/model-view/role.mv';
import { AppModel } from '@Domain/models/base/application.model';
import { BaseDataComponent } from '@components/base/base-data/base-data.component';
import { FormDataConfig } from '@Domain/models/forms/form-data-config.model';
import { UseBaseDataComponent } from 'src/app/core/interfaces/use-base-data.interface';
import { FormsProviders } from '@Application/config/providers/form.providers';

@Component({
  selector: 'app-permission',
  imports: [BaseDataComponent],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css',
  providers: [
    ...FormsProviders
  ]
})
export class PermissionComponent implements OnInit, UseBaseDataComponent {
  protected readonly moduleName = AppModel.MODULE_PERMISSIONS;
  headers: Map<string, string>;
  filterFields: Array<FormItemModel> = PermissionFilter.FIELDS;

  constructor(
    @Inject(PERMISSION_SERVICE)
    protected readonly service: ApiServicePort<PermissionModel, PermissionModelView>,
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    @Inject(ROLE_SERVICE)
    private readonly roleService: ApiServicePort<RoleModel, RoleModelView>,
  ) { }

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
    const roleAutocompleteField = createForm.fields.find(f => f.name === 'role');

    if (AppUtil.verifyEmpty(roleAutocompleteField.autocompleteOptions))
      roleAutocompleteField.autocompleteOptions = {
        filter: this.roleService
      };

    return [createForm];
  }
  initFilters(data: string): void {
    PermissionFilter.FIELDS.find(f => f.name === 'roleName').defaultValue = data;
  }
}
