import { ValidatorFn } from "@angular/forms";
import { SelectOptions } from "./select.options";
import { AutocompleteOptions } from "./auto-complete.options";
import { NumberFieldOptions } from "./number.options";

export class FormItemModel<T = any> {
    public static readonly TYPE_TEXT = 'text';
    public static readonly TYPE_PASSWORD = 'password';
    public static readonly TYPE_NUMBER = 'number';
    public static readonly TYPE_AUTO_COMPLETE = 'auto-complete';
    public static readonly TYPE_SELECT = 'select';
    public static readonly TYPE_DATETIME = 'datetime';

    public static readonly ITEM_TYPES = new Array<string>();

    static {
        this.ITEM_TYPES.push(FormItemModel.TYPE_TEXT);
        this.ITEM_TYPES.push(FormItemModel.TYPE_PASSWORD);
        this.ITEM_TYPES.push(FormItemModel.TYPE_NUMBER);
        this.ITEM_TYPES.push(FormItemModel.TYPE_AUTO_COMPLETE);
        this.ITEM_TYPES.push(FormItemModel.TYPE_SELECT);
        this.ITEM_TYPES.push(FormItemModel.TYPE_DATETIME);
    }

    name: string;
    type: 'text' | 'password' | 'number' | 'auto-complete' | 'select' | 'datetime';
    label: string;
    icon?: string;
    defaultValue?: T;
    validators?: Array<ValidatorFn>;
    selectOptions?: SelectOptions;
    autocompleteOptions?: AutocompleteOptions;
    numberOptions?: NumberFieldOptions;
    active?: boolean;
    transparent?: boolean;
}