import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class PaginatorServiceAdapter<T = any> {
    private readonly dataManager = new BehaviorSubject<Array<T>>([]);

    setData(data: Array<T>) {
        this.dataManager.next(data);
    }
    getData() {
        return this.dataManager.asObservable();
    }
}