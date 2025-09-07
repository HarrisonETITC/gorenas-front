import { UserModel } from "@gorenas/domain";
import { GeneralApiService } from "@gorenas/data-access-core";
import { UserModelView } from "@gorenas/domain";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_USER } from "@gorenas/application-core";

@Injectable()
export class UserServiceAdapter extends GeneralApiService<UserModel, UserModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_USER)
    }
}