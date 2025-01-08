import { Injectable } from "@angular/core";
import { FormDataServicePort } from "@Application/ports/forms/form-data-service.port";
import { FormDataConfig } from "@Domain/models/forms/form-data-config.model";
import { EventMessage } from "@Domain/models/general/event-message.interface";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class FormDataServiceAdapter implements FormDataServicePort {
    private readonly stateHandler: BehaviorSubject<boolean> = new BehaviorSubject(null);
    private readonly totalForms: BehaviorSubject<Array<FormDataConfig>> = new BehaviorSubject([]);
    private readonly formEventHandler: BehaviorSubject<EventMessage> = new BehaviorSubject({ event: '' });
    private readonly componentEventHandler: BehaviorSubject<EventMessage> = new BehaviorSubject({ event: '' });

    isFormActive(): Observable<boolean> {
        return this.stateHandler.asObservable();
    }
    updateState(state: boolean): void {
        this.stateHandler.next(state);
    }
    setForms(forms: Array<FormDataConfig>): void {
        this.totalForms.next(forms);
    }
    getForms(): Observable<Array<FormDataConfig>> {
        return this.totalForms.asObservable();
    }
    sendFormEvent(event: EventMessage): void {
        this.formEventHandler.next(event);
    }
    getFormEvent(): Observable<EventMessage> {
        return this.formEventHandler.asObservable();
    }
    sendComponentEvent(event: EventMessage): void {
        this.componentEventHandler.next(event);
    }
    getComponentEvent(): Observable<EventMessage> {
        return this.componentEventHandler.asObservable();
    }
}