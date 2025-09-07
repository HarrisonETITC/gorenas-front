export class BtnConfig {
    public static BASIC_EDIT_CONFIG: BtnConfig;
    public static BASIC_DISABLE_CONFIG: BtnConfig;

    static {
        this.BASIC_EDIT_CONFIG = new BtnConfig(
            true,
            'edit',
            'bg-action hover:bg-actionHover transition duration-300',
            'edit_outline',
            undefined,
            'Presiona este botón para editar el registro'
        );
        this.BASIC_DISABLE_CONFIG = new BtnConfig(
            true,
            'disable',
            'bg-btnSecondary hover:bg-btnSecondaryHover transition duration-300',
            'lock_outline',
            undefined,
            'Presiona este botón para inactivar el registro'
        );
    }

    private _show: boolean;
    private _action: string;
    private _style: string;
    private _icon?: string;
    private _label?: string;
    private _tooltip?: string;

    constructor(show: boolean, action: string = '', style: string = '', icon: string = '', label: string = '', tooltip: string = '') {
        this._show = show;
        this._action = action;
        this._style = style;
        this._icon = icon;
        this._label = label;
        this._tooltip = tooltip;
    }

    get show(): boolean {
        return this._show;
    }
    get action(): string {
        return this._action;
    }
    get style(): string {
        return this._style;
    }
    get icon(): string | undefined {
        return this._icon;
    }
    get label(): string | undefined {
        return this._label;
    }
    set label(label: string | undefined) {
        this._label = label;
    }
    get tooltip(): string | undefined {
        return this._tooltip;
    }
}