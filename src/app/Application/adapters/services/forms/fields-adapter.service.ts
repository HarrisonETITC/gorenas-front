import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FieldsServicePort } from "@Application/ports/forms/fields-service.port";
import { FormItemModel } from "@Domain/models/forms/items/form-item.model";
import { AppUtil } from "@utils/app.util";
import { FormsUtil } from "@utils/forms.util";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class FieldsServiceAdapter implements FieldsServicePort {
    private controls = new Map<string, FormControl>();
    private readonly fieldsHandler = new BehaviorSubject<Array<FormItemModel>>([]);
    private originalFields: Array<FormItemModel> = [];
    private actualFields: Array<FormItemModel> = [];
    private actualForm: FormGroup;

    init(fields: Array<FormItemModel>, form?: FormGroup) {
        if (this.initEarlyReturn(fields, form))
            return this.controls;

        /*
            Verificar si los campos que llegan son diferentes a los que están actualmente guardados en memoria, si es el caso, hay que procesarlos.
            Se compara contra los campos originales ya que los campos actuales podrían haber sido modificados por los diferentes handler de campos
            implementados.
        */
        if (!this.compareLocalFields(fields)) {
            this.controls = new Map<string, FormControl>();
            this.originalFields = fields;

            const extraFields: Array<FormItemModel> = [];
            for (const field of fields) {
                if (FormsUtil.FORMS_HANDLER.has(field.type)) {
                    FormsUtil.FORMS_HANDLER.get(field.type).validateField(field);
                    FormsUtil.FORMS_HANDLER.get(field.type).initField(field);
                    extraFields.push(...FormsUtil.FORMS_HANDLER.get(field.type).getExtraFields(field));
                }
            }
            for (const key of Array.from(FormsUtil.FORMS_HANDLER.keys()))
                fields = FormsUtil.FORMS_HANDLER.get(key).processExtraFields(extraFields, fields);

            this.actualFields = fields;
        } else {
            fields = this.actualFields;
        }

        if (!AppUtil.verifyEmpty(form)) {
            this.initForm(fields, form);
            this.actualForm = form;
        } else {
            this.initFields(fields);
        }

        return this.controls;
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
    manualUpdateFields(): void {
        this.fieldsHandler.next(this.actualFields);
    }
    getFields(): Observable<Array<FormItemModel>> {
        return this.fieldsHandler.asObservable();
    }
    flushService() {
        this.controls.clear();
        this.fieldsHandler.next([]);
        this.originalFields = [];
        this.actualFields = [];
        this.actualForm = null;
    }
    /*
        Verifica si los campos ya se encuentran inicializados, caso de que así sea, también verifica si se está inicizalizando un
        formulario o si este ya existe.
    */
    private initEarlyReturn(fields: Array<FormItemModel>, form?: FormGroup): boolean {
        /* 
            Primera validación: Que los campos originales (la cantidad de campos puede variar ya que un campo de tipo número, por ejemplo
            puede tener otros campos compuestos) no estén vacios y los compara con los campos que llegan. 
        */
        if (this.compareLocalFields(fields)) {
            /*
                Segunda validación: Se verifican 2 casos, que el formulario que llega está vacío, es decir, no se está inicializando un formulario,
                o si el formulario actual no se encuentra vacío. En cualquiera de estos 2 casos ya se puede hacer un retorno temprano para no
                inicializar los campos nuevamente.
            */
            if (AppUtil.verifyEmpty(form) || !AppUtil.verifyEmpty(this.actualForm)) {
                /*
                    Tercera validación: Se verifica si el formulario que llega se encuentra vacío, en caso de que lo esté y el formulario guardado en
                    memoria no esté vacío, entonces se copian los campos del formulario guardado en memoria al formulario que llega.
                */
                if (!AppUtil.verifyEmpty(form)) {
                    for (const controlKey of Object.keys(this.actualForm.controls)) {
                        form.setControl(controlKey, this.actualForm.get(controlKey));
                    }
                }

                return true;
            }
        }
        return false;
    }
    private compareLocalFields(fields: Array<FormItemModel>): boolean {
        return this.originalFields.length > 0 && this.originalFields.length === fields.length
            && this.originalFields.every(f => !AppUtil.verifyEmpty(fields.find(f2 => f.name === f2.name)));
    }
    private initForm(fields: Array<FormItemModel>, form: FormGroup) {
        for (const field of fields) {
            const insertControl = this.initControl(field);

            form.addControl(field.name, insertControl);
        }
    }
    private initFields(fields: Array<FormItemModel>) {
        for (const field of fields)
            this.initControl(field);
    }
    private initControl(field: FormItemModel): FormControl {
        let insertControl = null;

        if (this.existsControl(field.name))
            insertControl = this.getControl(field.name);
        else
            insertControl = new FormControl(field.defaultValue, { validators: (AppUtil.verifyEmpty(field.validators) ? [] : field.validators) });

        if (!this.existsControl(field.name))
            this.setControl(field.name, insertControl);
        return insertControl;
    }
}