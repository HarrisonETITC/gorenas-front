import { HttpClient } from "@angular/common/http";
import { URL_ALL, URL_AVAILABLE, URL_CAN_SEE, URL_CREATE, URL_DELETE, URL_ID, URL_MODIFY } from "@Application/config/endpoints/general.endpoints";
import { ApiServicePort } from "@Application/ports/api-service.port";
import { GeneralModel } from "@Domain/models/general/general.model";
import { IdValue } from "@Domain/models/general/id-value.interface";
import { Observable } from "rxjs";
import { apiUrl } from "src/app/environment";

export abstract class GeneralApiService<T extends GeneralModel, U = T> implements ApiServicePort<T, U> {
    protected baseUrl: string;

    constructor(
        protected readonly http: HttpClient,
        protected readonly endPoint: string
    ) {
        this.baseUrl = `${apiUrl}/${endPoint}/`;
    }

    getAll(): Observable<U[]> {
        return this.http.get<Array<U>>(`${this.baseUrl}/${URL_ALL}`);
    }
    getById(id: number): Observable<U> {
        return this.http.get<U>(`${this.baseUrl}${URL_ID}?id=${id}`);
    }
    create(data: T): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${URL_CREATE}`, data);
    }
    modify(data: T): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}${URL_MODIFY}`, data);
    }
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}${URL_DELETE}?id=${id}`);
    }
    getAvailable(query?: string): Observable<Array<IdValue>> {
        return this.http.get<Array<IdValue>>(`${this.baseUrl}${URL_AVAILABLE}?query=${query}`);
    }
    getCanSee(query?: string): Observable<U[]> {
        return this.http.get<Array<U>>(`${this.baseUrl}${URL_CAN_SEE}?query=${query}`);
    }
}