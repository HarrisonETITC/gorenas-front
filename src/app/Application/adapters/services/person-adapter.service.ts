import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { PersonModel } from "@Domain/models/base/person.model";
import { PersonModelView } from "@Domain/models/model-view/person.mv";
import { GeneralApiService } from "./general-api.service";
import { INFO_BY_USER_ID, URL_PERSON } from "@Application/config/endpoints/person.endpoints";
import { PersonPort } from "@Application/ports/person.port";
import { Observable } from "rxjs";
import { STORAGE_PROVIDER } from "@Application/config/providers/auth.providers";
import { UserModelView } from "@Domain/models/model-view/user.mv";

@Injectable()
export class PersonServiceAdapter extends GeneralApiService<PersonModel, PersonModelView>
    implements PersonPort {
    private readonly storage = inject(STORAGE_PROVIDER);
    private readonly user: UserModelView;

    constructor(
        http: HttpClient
    ) {
        super(http, URL_PERSON);
        this.user = this.storage.getItem('user');
    }

    getPersonInfo(): Observable<PersonModelView> {
        return this.http.get<PersonModelView>(`${this.baseUrl}${INFO_BY_USER_ID}?userId=${this.user.id}`);
    }
}