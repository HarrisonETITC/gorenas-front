import { ValidatorFn } from "@angular/forms";

export abstract class BaseFormItemPort<T> {
    public static readonly TYPE_TEXT = 'text';
    public static readonly TYPE_PASSWORD = 'password';
    public static readonly TYPE_NUMBER = 'number';
    public static readonly TYPE_AUTO_COMPLETE = 'auto-complete';
    public static readonly TYPE_SELECT = 'select';
    public static readonly TYPE_DATETIME = 'datetime';

    public static readonly ITEM_TYPES = new Array<string>();

    static {
        this.ITEM_TYPES.push(BaseFormItemPort.TYPE_TEXT);
        this.ITEM_TYPES.push(BaseFormItemPort.TYPE_PASSWORD);
        this.ITEM_TYPES.push(BaseFormItemPort.TYPE_NUMBER);
        this.ITEM_TYPES.push(BaseFormItemPort.TYPE_AUTO_COMPLETE);
        this.ITEM_TYPES.push(BaseFormItemPort.TYPE_SELECT);
        this.ITEM_TYPES.push(BaseFormItemPort.TYPE_DATETIME);
    }

    name: string;
    type: "number" | "text" | "password" | "auto-complete" | "select" | "datetime";
    label: string;
    icon?: string;
    defaultValue?: T;
    validators?: ValidatorFn[];
    active?: boolean;
    transparent?: boolean;
    abstract validate(): void | never;
}