import { GeneralModel } from "@Domain/models/general/general.model";
import { IdValue } from "@Domain/models/general/id-value.interface";
import { Observable } from "rxjs";

export interface ApiServicePort<T extends GeneralModel, U = T> {
    getAll(): Observable<Array<U>>;
    getById(id: number): Observable<U>;
    create(data: T): Observable<T>;
    modify(data: T): Observable<T>;
    delete(id: number): Observable<void>;
    getAvailable(query?: string): Observable<Array<IdValue>>;
    getCanSee(query?: string): Observable<Array<U>>;
}