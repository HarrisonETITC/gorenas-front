import { FormItemModel } from "@Domain/models/forms/form-item.model";

export interface FieldHandlerPort {
    validateField(field: FormItemModel): void;
    initField(field: FormItemModel): void;
    isFieldType(field: FormItemModel): boolean;
}