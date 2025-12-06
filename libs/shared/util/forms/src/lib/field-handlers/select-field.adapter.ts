import { FormItemModel } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { of } from "rxjs";
import { FieldInitializerPort } from "@gorenas/application-core";

export class SelectFieldAdapter implements FieldInitializerPort {
    validateField(field: FormItemModel): void {
        // Solo advertir si no hay opciones, pero no lanzar error
        if (AppUtil.verifyEmpty(field.selectOptions) || AppUtil.verifyEmpty(field.selectOptions.options)) {
            console.warn(`Campo select '${field.name}' sin opciones configuradas. Se inicializará con array vacío.`);
        }
    }
    initField(field: FormItemModel): void {
        // Inicializar selectOptions si no existe
        if (AppUtil.verifyEmpty(field.selectOptions)) {
            field.selectOptions = { options: [] };
        } else if (AppUtil.verifyEmpty(field.selectOptions.options)) {
            field.selectOptions.options = [];
        }
    }
    isFieldType(field: FormItemModel): boolean {
        return field.type === FormItemModel.TYPE_SELECT;
    }
    getExtraFields(field: FormItemModel): Array<FormItemModel> {
        return [];
    }
    processExtraFields(extraFields: Array<FormItemModel>, fields: Array<FormItemModel>) {
        return fields;
    }
    setValue(val: any, field: FormItemModel) {
        // Asignar el valor directamente (el código, no el texto)
        // El select usará este valor para seleccionar la opción correcta
        field.defaultValue = val;
        return of(undefined);
    }
}