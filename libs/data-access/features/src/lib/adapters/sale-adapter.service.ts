import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URL_SALE } from "@gorenas/application-core";
import { GeneralApiService } from "@gorenas/data-access-core";
import { SaleModel, SaleModelView } from "@gorenas/domain";

@Injectable()
export class SaleServiceAdapter extends GeneralApiService<SaleModel, SaleModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_SALE)
    }
}