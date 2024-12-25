import { FormItemModel } from "@Domain/models/form-item.model";
import { AppUtil } from "@utils/app.util";
import { FieldHandlerPort } from "src/app/core/interfaces/field-handler.port";

export class SelectFieldAdapter implements FieldHandlerPort {
    validateField(field: FormItemModel): void {
        if (AppUtil.verifyEmpty(field.selectOptions)) {
            throw new Error(`Las opciones son requeridas para un campo de tipo select. Nombre del campo sin opciones: '${field.name}'`);
        }
    }
    initField(field: FormItemModel): void {
        return;
    }
    isFieldType(field: FormItemModel): boolean {
        return field.type === FormItemModel.TYPE_SELECT;
    }
}