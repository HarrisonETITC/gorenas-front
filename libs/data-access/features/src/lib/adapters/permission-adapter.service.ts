import { PermissionModel } from "@gorenas/domain";
import { GeneralApiService } from "@gorenas/data-access-core";
import { PermissionModelView } from "@gorenas/domain";
import { URL_PERMISSION } from "@gorenas/application-core";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PermissionServiceAdapter extends GeneralApiService<PermissionModel, PermissionModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_PERMISSION);
    }
}