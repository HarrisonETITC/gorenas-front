import {
    IdValue,
    GeneralFilter,
    GetAvailablePort,
    GeneralModel,
    GetIdValueMany
} from "@gorenas/domain";
import { Observable } from "rxjs";

export interface ApiServicePort<T extends GeneralModel, U = T> extends GetAvailablePort, GetIdValueMany {
    getAll(): Observable<Array<U>>;
    getById(id: number): Observable<U>;
    create(data: T): Observable<T>;
    modify(data: T): Observable<T>;
    delete(id: number): Observable<void>;
    getAvailable(query?: string): Observable<Array<IdValue>>;
    getCanSee(params?: GeneralFilter): Observable<Array<U>>;
    getIdValueMany(values: Array<any>): Observable<Array<IdValue>>;
}