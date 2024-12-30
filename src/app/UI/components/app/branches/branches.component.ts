import { Component, Inject, OnInit } from '@angular/core';
import { BRANCH_SERVICE } from '@Application/config/providers/branch.providers';
import { ApiServicePort } from '@Application/ports/api-service.port';
import { BaseDataComponent } from '@components/base/base-data/base-data.component';
import { AppModel } from '@Domain/models/base/application.model';
import { BranchModel } from '@Domain/models/base/branch.model';
import { FormDataConfig } from '@Domain/models/forms/form-data-config.model';
import { FormItemModel } from '@Domain/models/forms/form-item.model';
import { BranchModelView } from '@Domain/models/model-view/branch.mv';
import { BranchFilter } from '@models/filter/branch.filter';
import { RestauranteService } from '@services/restaurante.service';
import { SucursalesService } from '@services/sucursales.service';
import { Observable, of } from 'rxjs';
import { UseBaseDataComponent } from 'src/app/core/interfaces/use-base-data.interface';

@Component({
  selector: 'app-branches',
  imports: [BaseDataComponent],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css',
  providers: [SucursalesService, RestauranteService]
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
    return [];
  }
  initFilters(data: any): void {
    throw new Error('Method not implemented.');
  }
}
