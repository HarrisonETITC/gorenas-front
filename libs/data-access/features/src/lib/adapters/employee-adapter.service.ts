import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EmployeeModel } from "@gorenas/domain";
import { EmployeeModelView } from "@gorenas/domain";
import { GeneralApiService } from "@gorenas/data-access-core";
import { URL_EMPLOYEE, URL_ID } from "@gorenas/application-core";
import { map, Observable } from "rxjs";

@Injectable()
export class EmployeeServiceAdapter extends GeneralApiService<EmployeeModel, EmployeeModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_EMPLOYEE);
    }

    override getById(id: number): Observable<EmployeeModelView> {
        return this.http.get<EmployeeModelView>(`${this.baseUrl}${URL_ID}?id=${id}`)
            .pipe(map(data => {
                (data as any)['person'] = data.name;
                return data;
            }));
    }
}