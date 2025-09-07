import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { PersonModel } from "@gorenas/domain";
import { PersonModelView } from "@gorenas/domain";
import { UserModelView } from "@gorenas/domain"; 

import { INFO_BY_USER_ID, URL_PERSON } from "@gorenas/application-core";
import { PersonPort } from "@gorenas/application-core";
import { STORAGE_PROVIDER } from "@gorenas/data-access-core";
import { GeneralApiService } from "@gorenas/data-access-core";

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