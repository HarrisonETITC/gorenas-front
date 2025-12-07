import { FormField } from "@gorenas/domain";
import { Observable } from "rxjs";

export interface FieldInitializerPort {
    validateField(field: FormField): void;
    initField(field: FormField): void;
    isFieldType(field: FormField): boolean;
    getExtraFields(field: FormField): Array<FormField>;
    processExtraFields(extraFields: Array<FormField>, fields: Array<FormField>): Array<FormField>;
    setValue(val: any, field: FormField): Observable<void>;
}