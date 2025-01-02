import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { URL_ROLE } from "@Application/config/endpoints/role.endpoints";
import { STORAGE_PROVIDER } from "@Application/config/providers/auth.providers";
import { RoleModel } from "@Domain/models/base/role.model";
import { RoleModelView } from "@Domain/models/model-view/role.mv";
import { UserModelView } from "@Domain/models/model-view/user.mv";
import { GeneralApiService } from "./general-api.service";

@Injectable()
export class RoleServiceAdapter extends GeneralApiService<RoleModel, RoleModelView> {
    private readonly storage = inject(STORAGE_PROVIDER);
    private readonly user: UserModelView;

    constructor(
        http: HttpClient
    ) {
        super(http, URL_ROLE);
        this.user = this.storage.getItem('user');
    }
}