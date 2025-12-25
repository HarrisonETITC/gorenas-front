import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BranchModel } from "@gorenas/domain";
import { BranchModelView } from "@gorenas/domain";
import { GeneralApiService } from "@gorenas/data-access-core";
import { URL_BRANCH } from "@gorenas/application-core";
import { Observable } from "rxjs";

@Injectable()
export class BranchServiceAdapter extends GeneralApiService<BranchModel, BranchModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_BRANCH);
    }

    override create(data: BranchModel): Observable<BranchModel> {
        data.restaurantId = data.restaurantId || 1;
        return super.create(data);
    }

    override modify(data: BranchModel): Observable<BranchModel> {
        data.restaurantId = data.restaurantId || 1;
        return super.modify(data);
    }
}