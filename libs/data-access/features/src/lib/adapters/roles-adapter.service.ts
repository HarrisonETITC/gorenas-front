import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { URL_ROLE, STORAGE_PROVIDER } from "@gorenas/application-core";
import { RoleModel, RoleModelView, UserModelView } from "@gorenas/domain";
import { GeneralApiService } from "@gorenas/data-access-core";

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