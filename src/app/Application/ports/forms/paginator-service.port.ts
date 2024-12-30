import { Observable } from "rxjs";

export interface PaginatorServicePort<T = any> {
    get originalData$(): Observable<Array<T>>;
    set originalData(data: Array<T>);
    get filteredData$(): Observable<Array<T>>;
    set filteredData(data: Array<T>);
}