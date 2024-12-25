import { Injectable } from "@angular/core";
import { FormDataServicePort } from "@Application/ports/forms/form-data-service.port";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class FormDataServiceAdapter implements FormDataServicePort {
    private readonly stateHandler: BehaviorSubject<boolean> = new BehaviorSubject(false);

    isFormActive(): Observable<boolean> {
        return this.stateHandler.asObservable();
    }
    updateState(state: boolean): void {
        this.stateHandler.next(state);
    }
}