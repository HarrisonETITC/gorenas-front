import { Component, Inject, OnInit } from "@angular/core";
import { ApiServicePort, BaseDataConfig, EMPLOYEE_SERVICE, SALE_SERVICE, UseBaseDataComponent } from "@gorenas/application-core";
import { AppModel, BtnConfig, EmployeeModel, EmployeeModelView, FormDataConfig, FormField, GeneralFilter, SaleModel, SaleModelView, TableConfig, isAutoCompleteFormItem, AutoCompleteFormItem } from "@gorenas/domain";
import { SaleForms } from "@gorenas/shared-util-forms";
import { BaseDataComponent } from "@gorenas/ui-commons";
import { Observable, of } from "rxjs";

@Component({
    selector: 'app-sales',
    imports: [BaseDataComponent],
    templateUrl: './sales.component.html',
    styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit, UseBaseDataComponent {
    protected readonly moduleName = AppModel.MODULE_SALES;
    protected actionHandlers: Map<string, (element: any) => void>;
    headers: Map<string, string>;
    filterFields: FormField[];
    pageConfig: BaseDataConfig;

    constructor(
        @Inject(SALE_SERVICE)
        protected readonly service: ApiServicePort<SaleModel, SaleModelView>,
        @Inject(EMPLOYEE_SERVICE)
        protected readonly employeeService: ApiServicePort<EmployeeModel, EmployeeModelView>
    ) { }

    ngOnInit(): void {
        this.headers = SaleModelView.headers;
        this.pageConfig = new BaseDataConfig('Ventas', 'Crear Venta');
    }
    getInitFilter(): Observable<GeneralFilter> {
        return of(null);
    }
    getForms(): Array<FormDataConfig> {
        const createForm = SaleForms.CREATE_FORM;
        createForm.dataInitializer = this.service;

        // Configurar endpoint para campo empleado
        const employeeField = createForm.fields.find(f => f.name === 'employee');
        if (isAutoCompleteFormItem(employeeField)) {
            (employeeField as AutoCompleteFormItem).endpoint = this.employeeService;
        }

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