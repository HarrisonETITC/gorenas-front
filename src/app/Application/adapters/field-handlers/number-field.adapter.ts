import { FormItemModel } from "@Domain/models/forms/items/form-item.model";
import { AppUtil } from "@utils/app.util";
import { FieldInitializerPort } from "src/app/core/interfaces/field-handler.port";

export class NumberFieldAdapter implements FieldInitializerPort {
    validateField(field: FormItemModel): void {
        if (AppUtil.verifyEmpty(field.numberOptions))
            throw new Error(`Las opciones son obligatorias para el campo de tipo number. Nombre del campo sin opciones '${field.name}'`);
    }
    initField(field: FormItemModel): void {
        return;
    }
    isFieldType(field: FormItemModel): boolean {
        return field.type === FormItemModel.TYPE_NUMBER;
    }
    getExtraFields(field: FormItemModel): Array<FormItemModel> {
        const extra: Array<FormItemModel> = [];
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
        return fields.filter(f => f.type !== FormItemModel.TYPE_NUMBER)
            .concat(extraFields.filter(f => f.type === FormItemModel.TYPE_NUMBER));
    }
}
