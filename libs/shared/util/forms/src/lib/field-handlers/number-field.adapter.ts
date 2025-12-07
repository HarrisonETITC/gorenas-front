import { BaseFormItemPort, NumberFormItem, NumberFieldOptions, FormField, isNumberFormItem } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { of } from "rxjs";
import { FieldInitializerPort } from "@gorenas/application-core";

/**
 * Obtiene las opciones de número del campo
 */
function getNumberOptions(field: FormField): NumberFieldOptions | undefined {
    if (isNumberFormItem(field)) {
        return field.numberOptions;
    }
    return undefined;
}

export class NumberFieldAdapter implements FieldInitializerPort {
    validateField(field: FormField): void {
        // numberOptions es opcional - solo validar si se necesitan features avanzadas
    }
    initField(field: FormField): void {
        // NumberFormItem ya está inicializado en el constructor
    }
    isFieldType(field: FormField): boolean {
        return field.type === BaseFormItemPort.TYPE_NUMBER;
    }
    getExtraFields(field: FormField): Array<FormField> {
        const extra: Array<FormField> = [];
        
        if (!isNumberFormItem(field)) {
            return extra;
        }
        
        const numberOptions = field.numberOptions;
        
        if (AppUtil.verifyEmpty(numberOptions)) {
            return extra;
        }
        
        if (numberOptions.enableGreatherThan) {
            const extraLabel = numberOptions.greatherThanLabel;
            const extraField = new NumberFormItem(
                `${field.name}GreatherThan`,
                `${field.label}${AppUtil.verifyEmpty(extraLabel) ? '' : extraLabel}`,
                'arrow_upward',
                field.defaultValue,
                field.validators || [],
                field.active,
                field.transparent,
                field.hideOnEdit
            );
            extra.push(extraField);
        }
        
        if (numberOptions.enableLessThan) {
            const extraLabel = numberOptions.lessThanLabel;
            const extraField = new NumberFormItem(
                `${field.name}LessThan`,
                `${field.label}${AppUtil.verifyEmpty(extraLabel) ? '' : extraLabel}`,
                'arrow_downward',
                field.defaultValue,
                field.validators || [],
                field.active,
                field.transparent,
                field.hideOnEdit
            );
            extra.push(extraField);
        }
        return extra;
    }
    processExtraFields(extraFields: Array<FormField>, fields: Array<FormField>) {
        const numberExtras = extraFields.filter(f => f.type === BaseFormItemPort.TYPE_NUMBER);
        return [...fields, ...numberExtras];
    }
    setValue(val: any, field: FormField) {
        const numericValue = val !== null && val !== undefined && val !== '' 
            ? Number(val) 
            : val;
        field.defaultValue = numericValue;
        return of(undefined);
    }
}
