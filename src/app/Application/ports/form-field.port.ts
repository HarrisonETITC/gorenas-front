import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export interface FormFieldComponentPort<T> {
    control?: FormControl;
    icon?: string;
    label: string;
    init(): void;
    getValue(): Observable<T>;
    verifyEmpty(val: any): boolean;
}