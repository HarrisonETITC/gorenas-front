import { UserModel } from "@Domain/models/base/user.model";
import { GeneralApiService } from "./general-api.service";
import { UserModelView } from "@Domain/models/model-view/user.mv";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_USER } from "@Application/config/endpoints/user.endpoints";

@Injectable()
export class UserServiceAdapter extends GeneralApiService<UserModel, UserModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_USER)
    }
}