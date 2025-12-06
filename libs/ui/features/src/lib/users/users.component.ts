import { Component, Inject, OnInit } from "@angular/core";
import { ApiServicePort, BaseDataConfig, UseBaseDataComponent, USER_SERVICE } from "@gorenas/application-core";
import { AppModel, BtnConfig, FormDataConfig, FormItemModel, GeneralFilter, UserModel, UserModelView } from "@gorenas/domain";
import { UserForms } from "@gorenas/shared-util-forms";
import { BaseDataComponent } from "@gorenas/ui-commons";
import { Observable, of } from "rxjs";

@Component({
    selector: 'app-users',
    imports: [BaseDataComponent],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, UseBaseDataComponent {
    protected readonly moduleName = AppModel.MODULE_USERS;
      protected actionHandlers: Map<string, (element: UserModel) => void>;
    headers: Map<string, string>;
    filterFields: FormItemModel<any>[];
    pageConfig: BaseDataConfig;

    constructor(
        @Inject(USER_SERVICE)
        protected readonly service: ApiServicePort<UserModel, UserModelView>
    ) { }

    ngOnInit(): void {
        this.headers = UserModelView.headers;
        this.pageConfig = new BaseDataConfig('Usuarios', 'Crear Usuario');
    }
    getInitFilter(): Observable<GeneralFilter> {
        return of(null);
    }
    getForms(): Array<FormDataConfig> {
        const createForm = UserForms.CREATE_FORM;
        createForm.dataInitializer = this.service;
        return [createForm];
    }
    initFilters(data: any): void {
        throw new Error("Method not implemented.");
    }
    getTableConfig(): any {
        return {
            buttons: [
                BtnConfig.BASIC_EDIT_CONFIG
            ]
        }
    }
}