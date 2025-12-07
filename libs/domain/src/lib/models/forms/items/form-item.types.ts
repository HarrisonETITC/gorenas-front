import { AutoCompleteFormItem } from "./auto-complete-form-item.model";
import { SelectFormItem } from "./select-form-item.model";
import { TextFormItem } from "./text-form-item.model";
import { FormItemModel } from "../form-item.model";
import { BaseFormItemPort } from "../../../interfaces/base-form-item.port";
import { FormField } from "../form-data-config.model";

/**
 * Union type que representa todos los tipos de form items disponibles (nuevas clases)
 */
export type FormItem = TextFormItem | SelectFormItem | AutoCompleteFormItem;

/**
 * Union type que incluye tanto las nuevas clases como el FormItemModel legacy
 */
export type AnyFormItem = FormItem | FormItemModel;

/**
 * Type guard para verificar si un item es de tipo TextFormItem
 */
export function isTextFormItem(item: FormField): item is TextFormItem {
    return item instanceof TextFormItem;
}

/**
 * Type guard para verificar si un item es de tipo SelectFormItem
 */
export function isSelectFormItem(item: FormField): item is SelectFormItem {
    return item instanceof SelectFormItem;
}

/**
 * Type guard para verificar si un item es de tipo AutoCompleteFormItem
 */
export function isAutoCompleteFormItem(item: FormField): item is AutoCompleteFormItem {
    return item instanceof AutoCompleteFormItem;
}

/**
 * Type guard para verificar si un item es del FormItemModel legacy
 */
export function isLegacyFormItem(item: FormField): item is FormItemModel {
    return item instanceof FormItemModel;
}

/**
 * Type guard para verificar si un campo es de tipo select (funciona con ambos sistemas)
 */
export function isSelectField(item: FormField): boolean {
    if (isSelectFormItem(item)) return true;
    if (isLegacyFormItem(item)) return item.type === FormItemModel.TYPE_SELECT;
    return item.type === BaseFormItemPort.TYPE_SELECT;
}

/**
 * Type guard para verificar si un campo es de tipo autocomplete (funciona con ambos sistemas)
 */
export function isAutoCompleteField(item: FormField): boolean {
    if (isAutoCompleteFormItem(item)) return true;
    if (isLegacyFormItem(item)) return item.type === FormItemModel.TYPE_AUTO_COMPLETE;
    return item.type === BaseFormItemPort.TYPE_AUTO_COMPLETE;
}

/**
 * Type guard para verificar si un campo es de tipo text/number/password
 */
export function isTextField(item: FormField): boolean {
    if (isTextFormItem(item)) return true;
    const type = item.type;
    return type === BaseFormItemPort.TYPE_TEXT || 
           type === BaseFormItemPort.TYPE_PASSWORD || 
           type === BaseFormItemPort.TYPE_NUMBER;
}

/**
 * Utility function para obtener el tipo de un form item
 */
export function getFormItemType(item: FormField): string {
    return item.type || 'unknown';
}
