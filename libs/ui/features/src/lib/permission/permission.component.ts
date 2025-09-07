import { Component, Inject, OnInit } from '@angular/core';
import { AUTH_SERVICE } from '@gorenas/data-access-core';
import { ApiServicePort } from '@gorenas/application-core';
import { AuthServicePort } from '@gorenas/application-core';
import { PermissionModel } from '@gorenas/domain';
import { FormItemModel } from '@gorenas/shared-util-forms';
import { PermissionModelView } from '@gorenas/domain';
import { PermissionFilter } from '@gorenas/shared-util-forms';
import { AppUtil } from '@gorenas/application-core';
import { filter, map, Observable, take, tap } from 'rxjs';
import { PermissionForms } from '@gorenas/shared-util-forms';
import { PERMISSION_SERVICE, ROLE_SERVICE } from '@gorenas/data-access-features';
import { FormsProviders } from '@gorenas/data-access-forms';
import { RoleModel } from '@gorenas/domain';
import { RoleModelView } from '@gorenas/domain';
import { AppModel } from '@gorenas/domain';
import { BaseDataComponent } from '@gorenas/ui-commons';
import { FormDataConfig } from '@gorenas/shared-util-forms';
import { UseBaseDataComponent } from '@gorenas/application-core';
import { TableConfig } from '@gorenas/domain';
import { BtnConfig } from '@gorenas/domain';

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
        endpoint: this.roleService
      };

    return [createForm];
  }
  initFilters(data: string): void {
    PermissionFilter.FIELDS.find(f => f.name === 'roleName').defaultValue = data;
  }
  getTableConfig(): TableConfig {
    return {
      buttons: [
        BtnConfig.BASIC_EDIT_CONFIG
      ]
    }
  }
}
