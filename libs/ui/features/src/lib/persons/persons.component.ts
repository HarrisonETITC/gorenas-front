import { Component, Inject, OnInit } from "@angular/core";
import { ApiServicePort, BaseDataConfig, PERSON_SERVICE, ROLE_SERVICE, UseBaseDataComponent, USER_SERVICE } from "@gorenas/application-core";
import { 
    AppModel, 
    BtnConfig, 
    FormDataConfig, 
    GeneralFilter, 
    PersonModel, 
    PersonModelView, 
    RoleModel, 
    RoleModelView, 
    TableConfig, 
    UserModel, 
    UserModelView,
    isAutoCompleteFormItem,
    AutoCompleteFormItem,
    FormField
} from "@gorenas/domain";
import { PersonForms } from "@gorenas/shared-util-forms";
import { BaseDataComponent } from "@gorenas/ui-commons";
import { Observable, of } from "rxjs";

@Component({
    selector: 'app-persons',
    imports: [BaseDataComponent],
    templateUrl: './persons.component.html',
    styleUrl: './persons.component.css'
})
export class PersonsComponent implements OnInit, UseBaseDataComponent {
    protected readonly moduleName = AppModel.MODULE_PERSONS;
    protected actionHandlers: Map<string, (element: PersonModel) => void>;
    headers: Map<string, string>;
    filterFields: FormField[];
    pageConfig: BaseDataConfig;

    constructor(
        @Inject(PERSON_SERVICE)
        protected readonly service: ApiServicePort<PersonModel, PersonModelView>,
        @Inject(USER_SERVICE)
        protected readonly userService: ApiServicePort<UserModel, UserModelView>,
        @Inject(ROLE_SERVICE)
        protected readonly roleService: ApiServicePort<RoleModel, RoleModelView>
    ) { }

    ngOnInit(): void {
        this.headers = PersonModelView.headers;
        this.pageConfig = new BaseDataConfig('Personas', 'Crear Persona');
    }
    getInitFilter(): Observable<GeneralFilter> {
        return of(null);
    }
    getForms(): Array<FormDataConfig> {
        const createForm = PersonForms.CREATE_FORM;
        createForm.dataInitializer = this.service;

        // Configurar endpoint para campo usuario
        const userField = createForm.fields.find(f => f.name === 'userId');
        if (isAutoCompleteFormItem(userField)) {
            (userField as AutoCompleteFormItem).endpoint = this.userService;
        }

        // Configurar endpoint para campo rol
        const roleField = createForm.fields.find(f => f.name === 'roleId');
        if (isAutoCompleteFormItem(roleField)) {
            (roleField as AutoCompleteFormItem).endpoint = this.roleService;
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
        };
    }
}