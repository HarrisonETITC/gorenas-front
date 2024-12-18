import { PermissionModel } from "@Domain/models/base/permission.model";
import { GeneralApiService } from "./general-api.service";
import { PermissionModelView } from "@Domain/models/model-view/permission.mv";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_PERMISSION } from "@Application/config/endpoints/permission.endpoints";

@Injectable()
export class PermissionServiceAdapter extends GeneralApiService<PermissionModel, PermissionModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_PERMISSION);
    }
}