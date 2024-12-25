import { FormControl, FormGroup } from "@angular/forms";

export interface FieldsServicePort {
    init(fields: Array<any>, form?: any): Map<string, FormControl>;
    setControlValue(name: string, value: any, form?: FormGroup): void;
    resetControls(): void;
    emptyControls(): boolean;
    removeControl(name: string): boolean;
    existsControl(name: string): boolean;
    setControl(name: string, control: any): void;
    getControl(name: string): FormControl;
}