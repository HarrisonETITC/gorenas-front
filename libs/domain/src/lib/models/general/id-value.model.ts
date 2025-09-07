export class IdValue {
    private _id: number;
    private _value: string;

    constructor(id: number, value: string) {
        this._id = id;
        this._value = value;
    }

    get id(): number {
        return this._id;
    }
    get value(): string {
        return this._value;
    }
}