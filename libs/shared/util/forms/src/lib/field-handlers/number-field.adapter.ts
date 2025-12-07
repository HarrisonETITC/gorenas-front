import { FormItemModel, BaseFormItemPort, NumberFormItem, NumberFieldOptions } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { of } from "rxjs";
import { FieldInitializerPort } from "@gorenas/application-core";

type NumberField = FormItemModel | NumberFormItem;

/**
 * Verifica si el campo es una instancia de NumberFormItem
 */
function isNumberFormItem(field: any): field is NumberFormItem {
    return field instanceof NumberFormItem;
}

/**
 * Obtiene las opciones de número del campo, sea FormItemModel o NumberFormItem
 */
function getNumberOptions(field: NumberField): NumberFieldOptions | undefined {
    if (isNumberFormItem(field)) {
        return field.numberOptions;
    }
    return (field as FormItemModel).numberOptions;
}

export class NumberFieldAdapter implements FieldInitializerPort {
    validateField(field: NumberField): void {
        // numberOptions es opcional - solo validar si se necesitan features avanzadas
        // No lanzar error si no hay opciones, simplemente no hacer nada
    }
    initField(field: NumberField): void {
        // Para NumberFormItem, las opciones ya están inicializadas en el constructor
        if (isNumberFormItem(field)) {
            return;
        }
        
        // Para FormItemModel legacy, inicializar numberOptions con valores por defecto si no existe
        const legacyField = field as FormItemModel;
        if (AppUtil.verifyEmpty(legacyField.numberOptions)) {
            legacyField.numberOptions = {
                enableGreatherThan: false,
                enableLessThan: false
            };
        }
    }
    isFieldType(field: NumberField): boolean {
        return field.type === BaseFormItemPort.TYPE_NUMBER;
    }
    getExtraFields(field: NumberField): Array<NumberField> {
        const extra: Array<NumberField> = [];
        const numberOptions = getNumberOptions(field);
        
        // Solo procesar si hay numberOptions configuradas
        if (AppUtil.verifyEmpty(numberOptions)) {
            return extra;
        }
        
        if (numberOptions.enableGreatherThan) {
            const extraLabel = numberOptions.greatherThanLabel;
            
            if (isNumberFormItem(field)) {
                // Crear nueva instancia de NumberFormItem para el campo extra
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
            } else {
                // Para FormItemModel legacy
                const fieldCopy = { ...field };
                fieldCopy.name = `${fieldCopy.name}GreatherThan`;
                fieldCopy.label = `${fieldCopy.label}${AppUtil.verifyEmpty(extraLabel) ? '' : extraLabel}`;
                fieldCopy.icon = 'arrow_upward';
                extra.push(fieldCopy);
            }
        }
        
        if (numberOptions.enableLessThan) {
            const extraLabel = numberOptions.lessThanLabel;
            
            if (isNumberFormItem(field)) {
                // Crear nueva instancia de NumberFormItem para el campo extra
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
            } else {
                // Para FormItemModel legacy
                const fieldCopy = { ...field };
                fieldCopy.name = `${fieldCopy.name}LessThan`;
                fieldCopy.label = `${fieldCopy.label}${AppUtil.verifyEmpty(extraLabel) ? '' : extraLabel}`;
                fieldCopy.icon = 'arrow_downward';
                extra.push(fieldCopy);
            }
        }
        return extra;
    }
    processExtraFields(extraFields: Array<NumberField>, fields: Array<NumberField>) {
        // Mantener campos originales Y agregar los extra (greaterThan/lessThan) si existen
        // Los campos extra se usan para filtros, los originales para CRUD
        const numberExtras = extraFields.filter(f => f.type === BaseFormItemPort.TYPE_NUMBER);
        return [...fields, ...numberExtras];
    }
    setValue(val: any, field: NumberField) {
        // Convertir a número para que los validadores min/max funcionen correctamente
        const numericValue = val !== null && val !== undefined && val !== '' 
            ? Number(val) 
            : val;
        field.defaultValue = numericValue;
        return of(undefined);
    }
}
