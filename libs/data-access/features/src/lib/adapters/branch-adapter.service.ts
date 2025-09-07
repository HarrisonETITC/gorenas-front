import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BranchModel } from "@gorenas/domain";
import { BranchModelView } from "@gorenas/domain";
import { GeneralApiService } from "@gorenas/data-access-core";
import { URL_BRANCH } from "@gorenas/application-core";

@Injectable()
export class BranchServiceAdapter extends GeneralApiService<BranchModel, BranchModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_BRANCH);
    }
}