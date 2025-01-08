import { FormItemModel } from "@Domain/models/forms/items/form-item.model";
import { AppUtil } from "@utils/app.util";
import { of } from "rxjs";
import { FieldInitializerPort } from "src/app/core/interfaces/field-handler.port";

export class SelectFieldAdapter implements FieldInitializerPort {
    validateField(field: FormItemModel): void {
        if (AppUtil.verifyEmpty(field.selectOptions) || AppUtil.verifyEmpty(field.selectOptions.options))
            throw new Error(`Las opciones son requeridas para un campo de tipo select. Nombre del campo sin opciones: '${field.name}'`);
    }
    initField(field: FormItemModel): void {
        return;
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
        field.defaultValue = field.selectOptions?.options.find((opt) => opt.value == val).viewValue ?? '';
        return of();
    }
}