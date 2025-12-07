import { FormControl, FormGroup } from "@angular/forms";
import { FormField } from "@gorenas/domain";
import { Observable } from "rxjs";

export interface FormBaseServicePort {
    init(fields: Array<FormField>, form?: FormGroup): Map<string, FormControl>;
    setControlValue(name: string, value: any, form?: FormGroup): void;
    resetControls(): void;
    emptyControls(): boolean;
    removeControl(name: string): boolean;
    existsControl(name: string): boolean;
    setControl(name: string, control: FormControl): void;
    getControl(name: string): FormControl;
    updateFields(fields: Array<FormField>, preserveValues?: boolean): void;
    manualUpdateFields(): void;
    getFields(): Observable<Array<FormField>>;
    flushService(): void;
    filtersEvent(): Observable<string>;
    sendFiltersEvent(ev?: string): void;
    getObject(): any;
}