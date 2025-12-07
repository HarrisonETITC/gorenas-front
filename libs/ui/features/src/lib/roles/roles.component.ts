import { Component, Inject, OnInit } from "@angular/core";
import { ApiServicePort, BaseDataConfig, ROLE_SERVICE, UseBaseDataComponent } from "@gorenas/application-core";
import { AppModel, BtnConfig, FormDataConfig, FormField, GeneralFilter, RoleModel, RoleModelView, TableConfig } from "@gorenas/domain";
import { RoleForms } from "@gorenas/shared-util-forms";
import { BaseDataComponent } from "@gorenas/ui-commons";
import { Observable, of } from "rxjs";

@Component({
    selector: 'app-roles',
    imports: [BaseDataComponent],
    templateUrl: './roles.component.html',
    styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit, UseBaseDataComponent {
    protected readonly moduleName = AppModel.MODULE_ROLES;
    protected actionHandlers: Map<string, (element: RoleModel) => void>;
    headers: Map<string, string>;
    filterFields: FormField[];
    pageConfig: BaseDataConfig;

    constructor(
        @Inject(ROLE_SERVICE)
        protected readonly service: ApiServicePort<RoleModel, RoleModelView>
    ) { }

    ngOnInit(): void {
        this.headers = RoleModelView.headers;
        this.pageConfig = new BaseDataConfig('Roles', 'Crear Rol');
    }
    getInitFilter(): Observable<GeneralFilter> {
        return of(null);
    }
    getForms(): Array<FormDataConfig> {
        const createForm = RoleForms.CREATE_FORM;
        createForm.dataInitializer = this.service;
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
        };
    }
}