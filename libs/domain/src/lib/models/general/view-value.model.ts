export class ViewValue {
    private _value: string;
    private _viewValue: string;
    private _icon?: string;

    constructor(value: string, viewValue: string, icon: string = '') {
        this._value = value;
        this._viewValue = viewValue;
        this._icon = icon;
    }

    get value(): string {
        return this._value;
    }
    get viewValue(): string {
        return this._viewValue;
    }
    get icon(): string {
        return this._icon;
    }
}