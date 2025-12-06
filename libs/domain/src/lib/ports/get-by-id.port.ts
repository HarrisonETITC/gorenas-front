import { Observable } from "rxjs";

export interface GetByIdPort<T> {
    getById(id: number, options?: Map<string, string>): Observable<T>;
}
