import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FieldsServicePort } from "@Application/ports/forms/fields-service.port";
import { FormItemModel } from "@Domain/models/forms/form-item.model";
import { AppUtil } from "@utils/app.util";
import { FormsUtil } from "@utils/forms.util";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class FieldsServiceAdapter implements FieldsServicePort {
    private controls = new Map<string, FormControl>();
    private readonly fieldsHandler = new BehaviorSubject<Array<FormItemModel>>([]);

    init(fields: Array<FormItemModel>, form?: FormGroup) {
        this.controls = new Map<string, FormControl>();
        for (const field of fields) {
            if (FormsUtil.FORMS_HANDLER.has(field.type)) {
                FormsUtil.FORMS_HANDLER.get(field.type).validateField(field);
                FormsUtil.FORMS_HANDLER.get(field.type).initField(field);
            }
        }

        if (!AppUtil.verifyEmpty(form)) {
            this.initForm(fields, form);
        } else {
            this.initFields(fields);
        }

        return this.controls;
    }
    private initForm(fields: Array<FormItemModel>, form: FormGroup) {
        for (const field of fields) {
            const insertControl = (this.existsControl(field.name)) ? this.getControl(field.name)
                : new FormControl(field.defaultValue, { validators: (AppUtil.verifyEmpty(field.validators) ? [] : field.validators) });

            if (!this.existsControl(field.name))
                this.setControl(field.name, insertControl);

            form.addControl(field.name, insertControl);
        }
    }
    private initFields(fields: Array<FormItemModel>) {
        for (const field of fields) {
            const insertControl = (this.existsControl(field.name)) ? this.getControl(field.name)
                : new FormControl(field.defaultValue, { validators: (AppUtil.verifyEmpty(field.validators) ? [] : field.validators) });

            if (!this.existsControl(field.name))
                this.setControl(field.name, insertControl);
        }
    }
    setControlValue(name: string, value: any, form?: FormGroup) {
        if (!this.existsControl(name))
            return;
        if (!AppUtil.verifyEmpty(form) && !AppUtil.verifyEmpty(form.get(name)))
            form.get(name).setValue(value)

        this.getControl(name).setValue(value, { emitEvent: false });
    }
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
        return this.controls.get(name);
    }
    updateFields(fields: Array<FormItemModel>): void {
        this.fieldsHandler.next(fields);
    }
    getFields(): Observable<Array<FormItemModel>> {
        return this.fieldsHandler.asObservable();
    }
}