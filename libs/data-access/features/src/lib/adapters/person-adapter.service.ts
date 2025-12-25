import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { PersonModel, PersonModelView, UserModelView } from "@gorenas/domain";

import { PersonPort, STORAGE_PROVIDER, INFO_BY_USER_ID, URL_PERSON, AppUtil, URL_MODIFY } from "@gorenas/application-core";
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

    override getById(id: number, options?: Map<string, string>): Observable<PersonModelView> {
        let url = `${this.baseUrl}id?id=${id}`;

        if (!AppUtil.verifyEmpty(options)) {
            const isEdition: string = (options!.get('isEdition'))!;
            if (!AppUtil.verifyEmpty(isEdition) && isEdition === 'true') url += `&edition=true`;

        }
        return this.http.get<PersonModelView>(url);
    }

    override create(data: PersonModel): Observable<PersonModel> {
        data.identification = `${data.identification}`;
        data.phoneNumber = `${data.phoneNumber}`;
        return super.create(data);
    }

    override modify(data: PersonModel): Observable<PersonModel> {
        data.identification = `${data.identification}`;
        data.phoneNumber = `${data.phoneNumber}`;
        return super.modify(data);
    }
}