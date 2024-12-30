import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BranchModel } from "@Domain/models/base/branch.model";
import { BranchModelView } from "@Domain/models/model-view/branch.mv";
import { GeneralApiService } from "./general-api.service";
import { URL_BRANCH } from "@Application/config/endpoints/branch.endpoints";

@Injectable()
export class BranchServiceAdapter extends GeneralApiService<BranchModel, BranchModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_BRANCH);
    }
}