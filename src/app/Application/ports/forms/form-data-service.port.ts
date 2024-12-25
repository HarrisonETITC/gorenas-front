import { Observable } from "rxjs";

export interface FormDataServicePort {
    isFormActive(): Observable<boolean>;
    updateState(state: boolean): void;
}