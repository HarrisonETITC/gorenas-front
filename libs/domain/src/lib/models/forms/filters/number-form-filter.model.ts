import { ValidatorFn } from "@angular/forms";
import { TextFormItem } from "../items/text-form-item.model";

export class NumberFormFilter extends TextFormItem {
    private _enableGreatherThan!: boolean;
    private _greatherThanLabel!: string;
    private _enableLessThan!: boolean;
    private _lessThanLabel!: string;

    constructor(
        name: string,
        label: string,
        icon: string = '',
        defaultValue: number = null,
        validators: Array<ValidatorFn> = [],
        active: boolean = false,
        transparent: boolean = false,
        enableGreatherThan: boolean = false,
        greatherThanLabel: string = '',
        enableLessThan: boolean = false,
        lessThanLabel: string = ''
    ) {
        super(name, 'number', label, icon, defaultValue, validators, active, transparent);
        this._enableGreatherThan = enableGreatherThan;
        this._greatherThanLabel = greatherThanLabel;
        this._enableLessThan = enableLessThan;
        this._lessThanLabel = lessThanLabel;
        this.validate();
    }

    get enableGreatherThan(): boolean {
        return this._enableGreatherThan;
    }
    get greatherThanLabel(): string {
        return this._greatherThanLabel;
    }
    get enableLessThan(): boolean {
        return this._enableLessThan;
    }
    get lessThanLabel(): string {
        return this._lessThanLabel;
    }
}