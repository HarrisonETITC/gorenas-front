import { Component, Inject, OnInit } from "@angular/core";
import { ApiServicePort, BaseDataConfig, BRANCH_SERVICE, EMPLOYEE_SERVICE, PERSON_SERVICE, UseBaseDataComponent } from "@gorenas/application-core";
import { FormItemModel, GeneralFilter, FormDataConfig, AppModel, EmployeeModel, EmployeeModelView, PersonModel, PersonModelView, BranchModelView, BranchModel, BtnConfig, TableConfig, AutocompleteOptions } from "@gorenas/domain";
import { EmployeeForms } from "@gorenas/shared-util-forms";
import { BaseDataComponent } from "@gorenas/ui-commons";
import { Observable, of } from "rxjs";

@Component({
  selector: 'app-employees',
  imports: [BaseDataComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit, UseBaseDataComponent {
  protected readonly moduleName = AppModel.MODULE_EMPLOYEES;
  protected actionHandlers: Map<string, (element: EmployeeModel) => void>;
  headers: Map<string, string>;
  filterFields: FormItemModel<any>[];
  pageConfig: BaseDataConfig;

  constructor(
    @Inject(EMPLOYEE_SERVICE)
    protected readonly service: ApiServicePort<EmployeeModel, EmployeeModelView>,
    @Inject(PERSON_SERVICE)
    protected readonly personService: ApiServicePort<PersonModel, PersonModelView>,
    @Inject(BRANCH_SERVICE)
    protected readonly branchService: ApiServicePort<BranchModel, BranchModelView>
  ) { }

  ngOnInit(): void {
    this.headers = EmployeeModelView.headers;
    this.pageConfig = new BaseDataConfig('Empleados', 'Crear Empleado');
  }
  getInitFilter(): Observable<GeneralFilter> {
    return of(null);
  }
  getForms(): Array<FormDataConfig> {
    const createForm = EmployeeForms.CREATE_FORM;
    createForm.dataInitializer = this.service;
    
    // Configurar autocomplete para persona
    const personAutocomplete = new AutocompleteOptions();
    personAutocomplete.endpoint = this.personService;
    createForm.fields[0].autocompleteOptions = personAutocomplete;
    
    // Configurar autocomplete para sucursal
    const branchAutocomplete = new AutocompleteOptions();
    branchAutocomplete.endpoint = this.branchService;
    createForm.fields[2].autocompleteOptions = branchAutocomplete;

    return [createForm];
  }
  initFilters(data: any): void {
    throw new Error("Method not implemented.");
  }
  getTableConfig(): TableConfig {
    return {
      buttons: [
        BtnConfig.BASIC_EDIT_CONFIG
      ]
    }
  }
}
