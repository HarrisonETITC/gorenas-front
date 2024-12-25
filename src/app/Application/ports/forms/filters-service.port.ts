import { Observable } from "rxjs";

export interface FiltersServicePort<T = any> {
    getFilter(): Observable<T>;
    updateFilter(filter: T): void;
}