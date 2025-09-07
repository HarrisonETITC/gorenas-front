
import { FormDataConfig, EventMessage } from "@gorenas/domain";
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
    resetFormsData(): void;
}