import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { 
  URL_ALL, 
  URL_AVAILABLE, 
  URL_CAN_SEE, 
  URL_CREATE, 
  URL_DELETE, 
  URL_ID, 
  URL_ID_VALUE, 
  URL_MODIFY, 
  API_URL_TOKEN, 
  ApiServicePort, 
  AppUtil 
} from "@gorenas/application-core";
import { GeneralModel, IdValue, GeneralFilter } from "@gorenas/domain";
import { defaultIfEmpty, Observable, of } from "rxjs";

export abstract class GeneralApiService<T extends GeneralModel, U = T> implements ApiServicePort<T, U> {
    protected baseUrl: string;

    constructor(
        protected readonly http: HttpClient,
        protected readonly endPoint: string
    ) {
        const apiUrl = inject(API_URL_TOKEN);
        this.baseUrl = `${apiUrl}/${endPoint}/`;
    }

    getAll(): Observable<U[]> {
        return this.http.get<Array<U>>(`${this.baseUrl}/${URL_ALL}`).pipe(
            defaultIfEmpty([])
        );
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
        if (AppUtil.verifyEmpty(query))
            return of([]);


        return this.http.get<Array<IdValue>>(`${this.baseUrl}${URL_AVAILABLE}?query=${encodeURIComponent(query!)}`)
    }
    getCanSee(params?: GeneralFilter): Observable<U[]> {
        const filters = AppUtil.processFiltersWithEncoding(params || {});
        const url = `${this.baseUrl}${URL_CAN_SEE}${filters}`;
        return this.http.get<Array<U>>(url).pipe(
            defaultIfEmpty([])
        );
    }
    getIdValueMany(values: Array<any>): Observable<Array<IdValue>> {
        const encodedValues = values.map(value => encodeURIComponent(value)).join(',');
        const url = `${this.baseUrl}${URL_ID_VALUE}?values=${encodedValues}`;
        return this.http.get<Array<IdValue>>(url);
    }
}