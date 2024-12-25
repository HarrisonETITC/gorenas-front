import { EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export interface FormFieldComponentPort<T> {
    control?: FormControl;
    isTransparent?: boolean;
    icon?: string;
    label: string;
    init(): void;
    getValue(): Observable<T>;
    verifyEmpty(val: any): boolean;
    updateData: EventEmitter<Observable<T>>;
    updateValue: EventEmitter<T>;
    getTransparentClass(): string;
}