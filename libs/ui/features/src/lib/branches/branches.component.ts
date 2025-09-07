import { Component, Inject, OnInit } from '@angular/core';
import { BranchForms } from '@gorenas/shared-util-forms';
import { BRANCH_SERVICE } from '@gorenas/data-access-features';
import { ApiServicePort } from '@gorenas/application-core';
import { BaseDataComponent } from '@gorenas/ui-commons';
import { AppModel } from '@gorenas/domain';
import { BranchModel } from '@gorenas/domain';
import { FormDataConfig } from '@gorenas/shared-util-forms';
import { FormItemModel } from '@gorenas/shared-util-forms';
import { BtnConfig } from '@gorenas/domain';
import { TableConfig } from '@gorenas/domain';
import { BranchModelView } from '@gorenas/domain';
import { BranchFilter } from '@gorenas/shared-util-forms';
import { Observable, of } from 'rxjs';
import { UseBaseDataComponent } from '@gorenas/application-core';

@Component({
  selector: 'app-branches',
  imports: [BaseDataComponent],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css',
})
export class BranchesComponent implements OnInit, UseBaseDataComponent {
  protected readonly moduleName = AppModel.MODULE_BRANCHES;
  headers: Map<string, string>;
  filterFields: FormItemModel<any>[] = BranchFilter.FIELDS;

  constructor(
    @Inject(BRANCH_SERVICE)
    protected readonly service: ApiServicePort<BranchModel, BranchModelView>
  ) { }

  ngOnInit(): void {
    this.headers = BranchModelView.headers;
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
