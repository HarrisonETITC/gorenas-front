import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppUtil, URL_SALE } from "@gorenas/application-core";
import { GeneralApiService } from "@gorenas/data-access-core";
import { SaleModel, SaleModelView } from "@gorenas/domain";
import { Observable } from "rxjs";

@Injectable()
export class SaleServiceAdapter extends GeneralApiService<SaleModel, SaleModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_SALE)
    }

    override getById(id: number, options?: Map<string, string>): Observable<SaleModelView> {
        let url = `${this.baseUrl}id?id=${id}`;

        if (!AppUtil.verifyEmpty(options)) {
            const isEdition: string = (options!.get('isEdition'))!;
            if (!AppUtil.verifyEmpty(isEdition) && isEdition === 'true') url += `&edition=true`;

        }
        return this.http.get<SaleModelView>(url);
    }
}