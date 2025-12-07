import { filter, map, Observable, take, tap } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import {
  PermissionModel,
  RoleModel,
  RoleModelView,
  AppModel,
  TableConfig,
  BtnConfig,
  PermissionModelView,
  isAutoCompleteFormItem,
  AutoCompleteFormItem,
  FormField
} from '@gorenas/domain';
import {
  ApiServicePort,
  AUTH_SERVICE,
  PERMISSION_SERVICE,
  ROLE_SERVICE,
  AuthServicePort,
  AppUtil,
  UseBaseDataComponent,
  BaseDataConfig
} from '@gorenas/application-core';
import { PermissionFilter, PermissionForms, FormDataConfig } from '@gorenas/shared-util-forms';
import { FormsProviders } from '@gorenas/data-access-forms';
import { BaseDataComponent } from '@gorenas/ui-commons';

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
  pageConfig: BaseDataConfig;
  headers: Map<string, string>;
  filterFields: Array<FormField> = PermissionFilter.FIELDS;

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
    this.pageConfig = new BaseDataConfig('Permisos', 'Agregar permiso');
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
    
    // Buscar el campo de rol y configurar el endpoint
    const roleField = createForm.fields.find(f => f.name === 'roleId');
    
    if (isAutoCompleteFormItem(roleField)) {
      // Nueva clase AutoCompleteFormItem - asignar endpoint directamente
      (roleField as AutoCompleteFormItem).endpoint = this.roleService;
    }

    return [createForm];
  }
  initFilters(data: string): void {
    PermissionFilter.FIELDS.find(f => f.name === 'roleName').defaultValue = data;
  }
  getTableConfig(): TableConfig {
    const columnMappings = new Map<string, Map<string, string>>();
    const moduleMap = PermissionModel.MODULES_MAP;
    columnMappings.set('module', moduleMap);
    const actionMap = PermissionModel.ACTIONS_MAP;
    columnMappings.set('action', actionMap);
    const componentMap = PermissionModel.COMPONENTS_MAP;
    columnMappings.set('component', componentMap);

    return {
      buttons: [
        BtnConfig.BASIC_EDIT_CONFIG
      ],
      columnMappings
    }
  }
}
