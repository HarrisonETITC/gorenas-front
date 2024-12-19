import { Observable } from "rxjs";

export interface UseTable<T> {
    data$: Observable<Array<T>>;
    cols$: Observable<Array<string>>;
    headers: Map<string, string>;
}