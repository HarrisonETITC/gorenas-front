
import { FormDataConfig } from "@Domain/models/forms/form-data-config.model";
import { EventMessage } from "@Domain/models/general/event-message.interface";
import { Observable } from "rxjs";

export interface FormDataServicePort {
    isFormActive(): Observable<boolean>;
    updateState(state: boolean): void;
    setForms(forms: Array<FormDataConfig>): void;
    getForms(): Observable<Array<FormDataConfig>>;
    sendFormEvent(event: EventMessage): void;
    getFormEvent(): Observable<EventMessage>;
    sendComponentEvent(event: EventMessage): void;
    getComponentEvent(): Observable<EventMessage>;
}