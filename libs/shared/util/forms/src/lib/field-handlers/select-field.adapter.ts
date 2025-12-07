import { FormItemModel, FormField, BaseFormItemPort, isSelectFormItem, SelectFormItem } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { of } from "rxjs";
import { FieldInitializerPort } from "@gorenas/application-core";

/**
 * Verifica si el campo es una instancia de SelectFormItem
 */
function isNewSelectFormItem(field: FormField): field is SelectFormItem {
    return isSelectFormItem(field);
}

/**
 * Obtiene las opciones del campo select (funciona con ambos sistemas)
 */
function getSelectOptions(field: FormField) {
    if (isNewSelectFormItem(field)) {
        return field.options;
    }
    const legacyField = field as FormItemModel;
    return legacyField.selectOptions?.options;
}

export class SelectFieldAdapter implements FieldInitializerPort {
    validateField(field: FormField): void {
        // Para nuevas clases (SelectFormItem), las opciones ya están validadas
        if (isNewSelectFormItem(field)) {
            if (AppUtil.verifyEmpty(field.options)) {
                console.warn(`Campo select '${field.name}' sin opciones configuradas.`);
            }
            return;
        }
        
        // Para clases legacy (FormItemModel)
        const legacyField = field as FormItemModel;
        if (AppUtil.verifyEmpty(legacyField.selectOptions) || AppUtil.verifyEmpty(legacyField.selectOptions.options)) {
            console.warn(`Campo select '${field.name}' sin opciones configuradas. Se inicializará con array vacío.`);
        }
    }
    initField(field: FormField): void {
        // Para nuevas clases (SelectFormItem), ya está inicializado en el constructor
        if (isNewSelectFormItem(field)) {
            return;
        }
        
        // Para clases legacy (FormItemModel)
        const legacyField = field as FormItemModel;
        if (AppUtil.verifyEmpty(legacyField.selectOptions)) {
            legacyField.selectOptions = { options: [] };
        } else if (AppUtil.verifyEmpty(legacyField.selectOptions.options)) {
            legacyField.selectOptions.options = [];
        }
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
        // Asignar el valor directamente (el código, no el texto)
        // El select usará este valor para seleccionar la opción correcta
        field.defaultValue = val;
        return of(undefined);
    }
}