import { ValidatorFn } from "@angular/forms";
import { GetAvailablePort } from "../../../ports/get-available.port";
import { GetIdValueMany } from "../../../ports/get-idvalue-many.port";
import { IdValue } from "../../general/id-value.model";
import { ViewValue } from "../../general/view-value.model";
import { BaseFormItemPort } from "../../../interfaces/base-form-item.port";
import { AutoCompleteFormItem } from "./auto-complete-form-item.model";
import { DateTimeFormItem } from "./datetime-form-item.model";
import { SelectFormItem } from "./select-form-item.model";
import { TextFormItem } from "./text-form-item.model";

/**
 * Configuración base para todos los form items
 */
export interface BaseFormItemConfig {
    name: string;
    label: string;
    icon?: string;
    defaultValue?: any;
    validators?: Array<ValidatorFn>;
    active?: boolean;
    transparent?: boolean;
    hideOnEdit?: boolean;
}

/**
 * Configuración específica para campos de texto, password y número
 */
export interface TextFormItemConfig extends BaseFormItemConfig {
    type: typeof BaseFormItemPort.TYPE_TEXT | 
          typeof BaseFormItemPort.TYPE_PASSWORD | 
          typeof BaseFormItemPort.TYPE_NUMBER;
    defaultValue?: string | number;
}

/**
 * Configuración específica para campos select
 */
export interface SelectFormItemConfig extends BaseFormItemConfig {
    options: Array<ViewValue>;
    defaultValue?: string;
}

/**
 * Configuración específica para campos autocomplete
 */
export interface AutoCompleteFormItemConfig extends BaseFormItemConfig {
    endpoint: GetAvailablePort & GetIdValueMany;
    defaultValue?: IdValue;
}

/**
 * Configuración específica para campos datetime
 */
export interface DateTimeFormItemConfig extends BaseFormItemConfig {
    defaultValue?: Date | string;
}

/**
 * Factory para crear diferentes tipos de form items de manera consistente
 */
export class FormItemFactory {
    
    /**
     * Crea un item de texto, password o número
     */
    static createTextItem(config: TextFormItemConfig): TextFormItem {
        return new TextFormItem(
            config.name,
            config.type,
            config.label,
            config.icon || '',
            config.defaultValue ?? null,
            config.validators || [],
            config.active || false,
            config.transparent || false,
            config.hideOnEdit || false
        );
    }

    /**
     * Crea un item select
     */
    static createSelectItem(config: SelectFormItemConfig): SelectFormItem {
        return new SelectFormItem(
            config.name,
            config.label,
            config.options || [],
            config.icon || '',
            config.defaultValue ?? null,
            config.validators || [],
            config.active || false,
            config.transparent || false,
            config.hideOnEdit || false
        );
    }

    /**
     * Crea un item autocomplete
     */
    static createAutoCompleteItem(config: AutoCompleteFormItemConfig): AutoCompleteFormItem {
        return new AutoCompleteFormItem(
            config.name,
            config.label,
            config.endpoint,
            config.icon || '',
            config.defaultValue ?? null,
            config.validators || [],
            config.active || false,
            config.transparent || false,
            config.hideOnEdit || false
        );
    }

    /**
     * Crea un item datetime
     */
    static createDateTimeItem(config: DateTimeFormItemConfig): DateTimeFormItem {
        return new DateTimeFormItem(
            config.name,
            config.label,
            config.icon || '',
            config.defaultValue ?? null,
            config.validators || [],
            config.active || false,
            config.transparent || false,
            config.hideOnEdit || false
        );
    }

    /**
     * Método helper para crear un campo de texto simple
     */
    static createSimpleTextField(name: string, label: string, required = false, hideOnEdit = false): TextFormItem {
        const validators = required ? [] : []; // Aquí se pueden agregar validadores según sea necesario
        return FormItemFactory.createTextItem({
            name,
            label,
            type: BaseFormItemPort.TYPE_TEXT,
            validators,
            hideOnEdit
        });
    }

    /**
     * Método helper para crear un campo de número simple
     */
    static createSimpleNumberField(name: string, label: string, required = false, hideOnEdit = false): TextFormItem {
        const validators = required ? [] : []; // Aquí se pueden agregar validadores según sea necesario
        return FormItemFactory.createTextItem({
            name,
            label,
            type: BaseFormItemPort.TYPE_NUMBER,
            validators,
            hideOnEdit
        });
    }

    /**
     * Método helper para crear un campo de password simple
     */
    static createSimplePasswordField(name: string, label: string, required = false, hideOnEdit = false): TextFormItem {
        const validators = required ? [] : []; // Aquí se pueden agregar validadores según sea necesario
        return FormItemFactory.createTextItem({
            name,
            label,
            type: BaseFormItemPort.TYPE_PASSWORD,
            validators,
            hideOnEdit
        });
    }
}
