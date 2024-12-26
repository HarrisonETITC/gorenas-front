
import { FormDataConfig } from "@Domain/models/forms/form-data-config.model";
import { Observable } from "rxjs";

export interface FormDataServicePort {
    isFormActive(): Observable<boolean>;
    updateState(state: boolean): void;
    setForms(forms: Array<FormDataConfig>): void;
    getForms(): Observable<Array<FormDataConfig>>;
}