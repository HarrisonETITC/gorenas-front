import { AutoCompleteFormItem } from "./auto-complete-form-item.model";
import { DateTimeFormItem } from "./datetime-form-item.model";
import { NumberFormItem } from "./number-form-item.model";
import { SelectFormItem } from "./select-form-item.model";
import { TextFormItem } from "./text-form-item.model";
import { BaseFormItemPort } from "../../../interfaces/base-form-item.port";
import { FormField } from "../form-data-config.model";

/**
 * Union type que representa todos los tipos de form items disponibles
 */
export type FormItem = TextFormItem | SelectFormItem | AutoCompleteFormItem | DateTimeFormItem | NumberFormItem;

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
 * Type guard para verificar si un item es de tipo DateTimeFormItem
 */
export function isDateTimeFormItem(item: FormField): item is DateTimeFormItem {
    return item instanceof DateTimeFormItem;
}

/**
 * Type guard para verificar si un item es de tipo NumberFormItem
 */
export function isNumberFormItem(item: FormField): item is NumberFormItem {
    return item instanceof NumberFormItem;
}

/**
 * Type guard para verificar si un campo es de tipo select
 */
export function isSelectField(item: FormField): boolean {
    return isSelectFormItem(item) || item.type === BaseFormItemPort.TYPE_SELECT;
}

/**
 * Type guard para verificar si un campo es de tipo autocomplete
 */
export function isAutoCompleteField(item: FormField): boolean {
    return isAutoCompleteFormItem(item) || item.type === BaseFormItemPort.TYPE_AUTO_COMPLETE;
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
 * Type guard para verificar si un campo es de tipo datetime
 */
export function isDateTimeField(item: FormField): boolean {
    return isDateTimeFormItem(item) || item.type === BaseFormItemPort.TYPE_DATETIME;
}

/**
 * Utility function para obtener el tipo de un form item
 */
export function getFormItemType(item: FormField): string {
    return item.type || 'unknown';
}
