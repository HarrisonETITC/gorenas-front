import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EmployeeModel } from "@gorenas/domain";
import { EmployeeModelView } from "@gorenas/domain";
import { GeneralApiService } from "@gorenas/data-access-core";
import { AppUtil, URL_EMPLOYEE, URL_ID } from "@gorenas/application-core";
import { map, Observable } from "rxjs";

@Injectable()
export class EmployeeServiceAdapter extends GeneralApiService<EmployeeModel, EmployeeModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_EMPLOYEE);
    }

    override getById(id: number, options?: Map<string, string>): Observable<EmployeeModelView> {
        let url = `${this.baseUrl}id?id=${id}`;

        if (!AppUtil.verifyEmpty(options)) {
            const isEdition: string = (options!.get('isEdition'))!;
            if (!AppUtil.verifyEmpty(isEdition) && isEdition === 'true') url += `&edition=true`;

        }
        return this.http.get<EmployeeModelView>(`${url}`)
            .pipe(map(data => {
                (data as any)['person'] = data.name;
                return data;
            }));
    }
}