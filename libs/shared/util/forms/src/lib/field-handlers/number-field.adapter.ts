import { FormItemModel } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { of } from "rxjs";
import { FieldInitializerPort } from "@gorenas/application-core";

export class NumberFieldAdapter implements FieldInitializerPort {
    validateField(field: FormItemModel): void {
        // numberOptions es opcional - solo validar si se necesitan features avanzadas
        // No lanzar error si no hay opciones, simplemente no hacer nada
    }
    initField(field: FormItemModel): void {
        // Inicializar numberOptions con valores por defecto si no existe
        if (AppUtil.verifyEmpty(field.numberOptions)) {
            field.numberOptions = {
                enableGreatherThan: false,
                enableLessThan: false
            };
        }
    }
    isFieldType(field: FormItemModel): boolean {
        return field.type === FormItemModel.TYPE_NUMBER;
    }
    getExtraFields(field: FormItemModel): Array<FormItemModel> {
        const extra: Array<FormItemModel> = [];
        
        // Solo procesar si hay numberOptions configuradas
        if (AppUtil.verifyEmpty(field.numberOptions)) {
            return extra;
        }
        
        if (field.numberOptions.enableGreatherThan) {
            const fieldCopy = { ...field };
            const extraLabel = field.numberOptions.greatherThanLabel;
            fieldCopy.name = `${fieldCopy.name}GreatherThan`;
            fieldCopy.label = `${fieldCopy.label}${AppUtil.verifyEmpty(extraLabel) ? '' : extraLabel}`;
            fieldCopy.icon = 'arrow_upward';

            extra.push(fieldCopy);
        }
        if (field.numberOptions.enableLessThan) {
            const fieldCopy = { ...field };
            const extraLabel = field.numberOptions.lessThanLabel;
            fieldCopy.name = `${fieldCopy.name}LessThan`;
            fieldCopy.label = `${fieldCopy.label}${AppUtil.verifyEmpty(extraLabel) ? '' : extraLabel}`;
            fieldCopy.icon = `arrow_downward`;

            extra.push(fieldCopy);
        }
        return extra;
    }
    processExtraFields(extraFields: Array<FormItemModel>, fields: Array<FormItemModel>) {
        // Mantener campos originales Y agregar los extra (greaterThan/lessThan) si existen
        // Los campos extra se usan para filtros, los originales para CRUD
        const numberExtras = extraFields.filter(f => f.type === FormItemModel.TYPE_NUMBER);
        return [...fields, ...numberExtras];
    }
    setValue(val: any, field: FormItemModel) {
        field.defaultValue = val;
        return of();
    }
}
