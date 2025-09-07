import { Observable } from "rxjs";

export interface GetByIdPort<T> {
    getById(id: number): Observable<T>;
}