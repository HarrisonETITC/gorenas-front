import { Component, Inject, OnInit } from '@angular/core';
import { ApiServicePort, BaseDataConfig, BRANCH_SERVICE, UseBaseDataComponent } from '@gorenas/application-core';
import { BaseDataComponent } from '@gorenas/ui-commons';
import { AppModel, BranchModel, BtnConfig, TableConfig, BranchModelView } from '@gorenas/domain';
import { FormDataConfig, FormItemModel, BranchFilter, BranchForms } from '@gorenas/shared-util-forms';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-branches',
  imports: [BaseDataComponent],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css',
})
export class BranchesComponent implements OnInit, UseBaseDataComponent {
  protected readonly moduleName = AppModel.MODULE_BRANCHES;
  protected pageConfig: BaseDataConfig;
  headers: Map<string, string>;
  filterFields: FormItemModel<any>[] = BranchFilter.FIELDS;

  constructor(
    @Inject(BRANCH_SERVICE)
    protected readonly service: ApiServicePort<BranchModel, BranchModelView>
  ) { }

  ngOnInit(): void {
    this.headers = BranchModelView.headers;
    this.pageConfig = new BaseDataConfig('Sucursales', 'Crear Sucursal');
  }
  getInitFilter(): Observable<BranchFilter> {
    return of(null);
  }
  getForms(): Array<FormDataConfig> {
    const createForm = BranchForms.CREATE_FORM;
    createForm.dataInitializer = this.service;

    return [createForm];
  }
  initFilters(data: any): void {
    throw new Error('Method not implemented.');
  }
  getTableConfig(): TableConfig {
    return {
      buttons: [
        BtnConfig.BASIC_EDIT_CONFIG,
        BtnConfig.BASIC_DISABLE_CONFIG,
      ]
    }
  }
}
