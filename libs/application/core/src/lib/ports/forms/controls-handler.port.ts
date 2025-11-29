import { FormControl } from "@angular/forms";
import { FormItemModel } from "@gorenas/domain";
import { BehaviorSubject, Observable } from "rxjs";

export abstract class ControlsHandlerPort {
    protected fieldsHandler = new BehaviorSubject<Array<FormItemModel>>([]);
    protected controls = new Map<string, FormControl>();
    protected originalFields: Array<FormItemModel> = [];
    protected actualFields: Array<FormItemModel> = [];

    resetControls() {
        this.controls.clear();
    }
    emptyControls() {
        return this.controls.size === 0;
    }
    removeControl(name: string) {
        return this.controls.delete(name);
    }
    existsControl(name: string) {
        return this.controls.has(name);
    }
    setControl(name: string, control: FormControl) {
        this.controls.set(name, control);
    }
    getControl(name: string): FormControl {
        if (!this.existsControl(name))
            throw new Error(`El control con nombre ${name} no existe`);

        return this.controls.get(name)!;
    }
    updateFields(fields: Array<FormItemModel>): void {
        this.fieldsHandler.next(fields);
    }
    manualUpdateFields(): void {
        this.fieldsHandler.next(this.actualFields);
    }
    getFields(): Observable<Array<FormItemModel>> {
        return this.fieldsHandler.asObservable();
    }
    resetService() {
        this.controls.clear();
    }
}