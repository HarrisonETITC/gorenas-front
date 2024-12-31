import { FormControl, FormGroup } from "@angular/forms";
import { FormItemModel } from "@Domain/models/forms/items/form-item.model";
import { Observable } from "rxjs";

export interface FieldsServicePort {
    init(fields: Array<any>, form?: any): Map<string, FormControl>;
    setControlValue(name: string, value: any, form?: FormGroup): void;
    resetControls(): void;
    emptyControls(): boolean;
    removeControl(name: string): boolean;
    existsControl(name: string): boolean;
    setControl(name: string, control: any): void;
    getControl(name: string): FormControl;
    updateFields(fields: Array<FormItemModel>): void;
    manualUpdateFields(): void;
    getFields(): Observable<Array<FormItemModel>>;
    flushService(): void;
    filtersEvent(): Observable<string>;
    sendFiltersEvent(ev?: string): void;
    getObject(): any;
}