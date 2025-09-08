export class BaseDataConfig {
    private _pageName: string;
    private _createButtonLabel: string;

    constructor(pageName: string, createButtonLabel: string) {
        this._pageName = pageName;
        this._createButtonLabel = createButtonLabel;
    }

    get pageName(): string {
        return this._pageName;
    }
    get createButtonLabel(): string {
        return this._createButtonLabel;
    }
}