import { Injectable } from "@angular/core";
import { PaginatorServicePort } from "@Application/ports/forms/paginator-service.port";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class PaginatorServiceAdapter<T = any> implements PaginatorServicePort<T> {
    private readonly filteredDataManager = new BehaviorSubject<Array<T>>([]);
    private readonly originalDataManager = new BehaviorSubject<Array<T>>([]);
    private readonly detectChangesHandler = new BehaviorSubject<string>('');

    get originalData$(): Observable<T[]> {
        return this.originalDataManager.asObservable();
    }
    set originalData(data: T[]) {
        this.originalDataManager.next(data);
    }
    get filteredData$(): Observable<T[]> {
        return this.filteredDataManager.asObservable();
    }
    set filteredData(data: T[]) {
        this.filteredDataManager.next(data);
    }
    get detectChanges$(): Observable<string> {
        return this.detectChangesHandler.asObservable();
    }
    sendChangeEvent(ev: string = 'detect'): void {
        this.detectChangesHandler.next(ev);
    }
}