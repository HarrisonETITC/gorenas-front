import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EmployeeModel } from "@gorenas/domain";
import { EmployeeModelView } from "@gorenas/domain";
import { GeneralApiService } from "@gorenas/data-access-core";
import { URL_EMPLOYEE } from "@gorenas/application-core";

@Injectable()
export class EmployeeServiceAdapter extends GeneralApiService<EmployeeModel, EmployeeModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_EMPLOYEE);
    }
}