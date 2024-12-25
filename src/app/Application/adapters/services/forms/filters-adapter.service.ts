import { Injectable } from "@angular/core";
import { FiltersServicePort } from "@Application/ports/forms/filters-service.port";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class FiltersServiceAdapter<T> implements FiltersServicePort<T> {
    private readonly filterHandler: BehaviorSubject<T> = new BehaviorSubject(null);

    getFilter(): Observable<T> {
        return this.filterHandler.asObservable();
    }
    updateFilter(filter: T): void {
        this.filterHandler.next(filter);
    }
}