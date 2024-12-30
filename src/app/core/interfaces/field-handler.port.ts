import { FormItemModel } from "@Domain/models/forms/items/form-item.model";

export interface FieldInitializerPort {
    validateField(field: FormItemModel): void;
    initField(field: FormItemModel): void;
    isFieldType(field: FormItemModel): boolean;
    getExtraFields(field: FormItemModel): Array<FormItemModel>;
    processExtraFields(extraFields: Array<FormItemModel>, fields: Array<FormItemModel>): Array<FormItemModel>;
}