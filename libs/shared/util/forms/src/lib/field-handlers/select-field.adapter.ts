import { FormField, BaseFormItemPort, isSelectFormItem } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { of } from "rxjs";
import { FieldInitializerPort } from "@gorenas/application-core";

export class SelectFieldAdapter implements FieldInitializerPort {
    validateField(field: FormField): void {
        if (!isSelectFormItem(field)) {
            console.warn(`Campo '${field.name}' no es de tipo SelectFormItem`);
            return;
        }
        if (AppUtil.verifyEmpty(field.options)) {
            console.warn(`Campo select '${field.name}' sin opciones configuradas.`);
        }
    }
    initField(field: FormField): void {
        // SelectFormItem ya está inicializado en el constructor
    }
    isFieldType(field: FormField): boolean {
        return field.type === BaseFormItemPort.TYPE_SELECT;
    }
    getExtraFields(field: FormField): Array<FormField> {
        return [];
    }
    processExtraFields(extraFields: Array<FormField>, fields: Array<FormField>): Array<FormField> {
        return fields;
    }
    setValue(val: any, field: FormField) {
        field.defaultValue = val;
        return of(undefined);
    }
}