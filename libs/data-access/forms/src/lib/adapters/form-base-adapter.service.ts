import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FormBaseServicePort } from "@gorenas/application-core";
import { FormField, IdValue, BaseFormItemPort } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { FormsUtil } from "@gorenas/shared-util-forms";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class FormBaseServiceAdapter implements FormBaseServicePort {
    private readonly fieldsHandler = new BehaviorSubject<Array<FormField>>([]);
    private readonly cleanFiltersHandler = new BehaviorSubject<string>('');
    private controls = new Map<string, FormControl>();
    private originalFields: Array<FormField> = [];
    private actualFields: Array<FormField> = [];

    init(fields: Array<FormField>, form?: FormGroup) {
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

            const extraFields: Array<FormField> = [];
            for (const field of fields) {
                if (FormsUtil.FORMS_HANDLER.has(field.type)) {
                    FormsUtil.FORMS_HANDLER.get(field.type)?.validateField(field);
                    FormsUtil.FORMS_HANDLER.get(field.type)?.initField(field);
                    extraFields.push(...FormsUtil.FORMS_HANDLER.get(field.type)?.getExtraFields(field) ?? []);
                }
            }
            for (const key of Array.from(FormsUtil.FORMS_HANDLER.keys()))
                fields = FormsUtil.FORMS_HANDLER.get(key)?.processExtraFields(extraFields, fields)?? [];

            this.actualFields = fields;
        } else {
            fields = this.actualFields;
        }

        if (!AppUtil.verifyEmpty(form)) {
            this.initForm(fields, form!);
        } else {
            this.initFields(fields);
        }

        // Emitir los campos procesados para que los componentes puedan recibirlos
        this.fieldsHandler.next(this.actualFields);

        return this.controls;
    }
    setControlValue(name: string, value: any, form?: FormGroup) {
        if (!this.existsControl(name))
            return;
        if (!AppUtil.verifyEmpty(form) && !AppUtil.verifyEmpty(form!.get(name)))
            form!.get(name)?.setValue(value)

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
        if (!this.existsControl(name))
            throw new Error(`El control con nombre ${name} no existe`);

        return this.controls.get(name)!;
    }
    updateFields(fields: Array<FormField>, preserveValues: boolean = true): void {
        if (!preserveValues) {
            // Solo actualizar valores si se pide explícitamente
            for (const field of fields) {
                if (this.existsControl(field.name) && field.defaultValue !== undefined) {
                    this.getControl(field.name).setValue(field.defaultValue, { emitEvent: false });
                }
            }
        }
        // Actualizar actualFields para mantener consistencia
        this.actualFields = fields;
        this.fieldsHandler.next(fields);
    }
    manualUpdateFields(): void {
        this.fieldsHandler.next(this.actualFields);
    }
    getFields(): Observable<Array<FormField>> {
        return this.fieldsHandler.asObservable();
    }
    flushService() {
        this.controls.clear();
        this.fieldsHandler.next([]);
        this.originalFields = [];
        this.actualFields = [];
    }
    filtersEvent(): Observable<string> {
        return this.cleanFiltersHandler.asObservable();
    }
    sendFiltersEvent(ev: string = 'clean'): void {
        this.cleanFiltersHandler.next(ev);
    }
    getObject() {
        const obj: { [key: string]: any } = {};

        for (const controlKey of Array.from(this.controls.keys())) {
            const control = this.getControl(controlKey);

            if (!AppUtil.verifyEmpty(control.value)) {
                let value = control.value;
                const field = this.actualFields.find(f => f.name === controlKey);
                
                // Si el valor es un objeto con 'id' (ej: autocomplete), extraer el id
                if (field?.type === BaseFormItemPort.TYPE_AUTO_COMPLETE && value !== null && typeof value === 'object' && 'id' in value) {
                    obj[controlKey] = (value as IdValue)?.id;
                } 
                // Si es un campo de tipo número, convertir a número
                else if (field?.type === BaseFormItemPort.TYPE_NUMBER && typeof value === 'string') {
                    obj[controlKey] = Number(value);
                } 
                else {
                    obj[controlKey] = value;
                }
            }
        }

        return obj;
    }
    /*
        Verifica si los campos ya se encuentran inicializados, caso de que así sea, también verifica si se está inicizalizando un
        formulario o si este ya existe.
    */
    private initEarlyReturn(fields: Array<FormField>, form?: FormGroup): boolean {
        /* 
            Primera validación: Que los campos originales (la cantidad de campos puede variar ya que un campo de tipo número, por ejemplo
            puede tener otros campos compuestos) no estén vacios y los compara con los campos que llegan. 
        */
        if (this.compareLocalFields(fields)) {
            /*
                Si llega un formulario no vacío entonces se asignan los controles guardados al mismo.
            */
            if (!AppUtil.verifyEmpty(form)) {
                for (const controlKey of Array.from(this.controls.keys())) {
                    form!.setControl(controlKey, this.controls.get(controlKey));
                }

                return true;
            }
        }
        return false;
    }
    private compareLocalFields(fields: Array<FormField>): boolean {
        return this.originalFields.length > 0 && this.originalFields.length === fields.length
            && this.originalFields.every(f => !AppUtil.verifyEmpty(fields.find(f2 => f.name === f2.name)));
    }
    private initForm(fields: Array<FormField>, form: FormGroup) {
        for (const field of fields) {
            const insertControl = this.initControl(field);

            form.addControl(field.name, insertControl);
        }
    }
    private initFields(fields: Array<FormField>) {
        for (const field of fields)
            this.initControl(field);
    }
    private initControl(field: FormField): FormControl {
        let insertControl = null;

        if (this.existsControl(field.name)) {
            // Si el control ya existe, preservar el valor actual del usuario
            // No sobrescribir con defaultValue para no perder estado al cambiar entre vistas
            insertControl = this.getControl(field.name);
        }
        else {
            insertControl = new FormControl(field.defaultValue, { validators: (AppUtil.verifyEmpty(field.validators) ? [] : field.validators) });
            this.setControl(field.name, insertControl);
        }

        return insertControl;
    }
}