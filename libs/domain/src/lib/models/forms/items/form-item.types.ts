import { AutoCompleteFormItem } from "./auto-complete-form-item.model";
import { SelectFormItem } from "./select-form-item.model";
import { TextFormItem } from "./text-form-item.model";

/**
 * Union type que representa todos los tipos de form items disponibles
 */
export type FormItem = TextFormItem | SelectFormItem | AutoCompleteFormItem;

/**
 * Type guard para verificar si un item es de tipo TextFormItem
 */
export function isTextFormItem(item: FormItem): item is TextFormItem {
    return item instanceof TextFormItem;
}

/**
 * Type guard para verificar si un item es de tipo SelectFormItem
 */
export function isSelectFormItem(item: FormItem): item is SelectFormItem {
    return item instanceof SelectFormItem;
}

/**
 * Type guard para verificar si un item es de tipo AutoCompleteFormItem
 */
export function isAutoCompleteFormItem(item: FormItem): item is AutoCompleteFormItem {
    return item instanceof AutoCompleteFormItem;
}

/**
 * Utility function para obtener el tipo de un form item
 */
export function getFormItemType(item: FormItem): string {
    if (isTextFormItem(item)) return item.type;
    if (isSelectFormItem(item)) return 'select';
    if (isAutoCompleteFormItem(item)) return 'auto-complete';
    return 'unknown';
}
