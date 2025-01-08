export class BtnConfig {
    public static BASIC_EDIT_CONFIG: BtnConfig = new BtnConfig(true);
    public static BASIC_DISABLE_CONFIG: BtnConfig = new BtnConfig(true);

    static {
        this.BASIC_EDIT_CONFIG = {
            ...this.BASIC_EDIT_CONFIG,
            action: 'edit',
            style: 'bg-action hover:bg-actionHover transition duration-300',
            icon: 'edit_outline',
            tooltip: 'Presiona este botón para editar el registro'
        }
        this.BASIC_DISABLE_CONFIG = {
            ...this.BASIC_DISABLE_CONFIG,
            action: 'disable',
            style: 'bg-btnSecondary hover:bg-btnSecondaryHover transition duration-300',
            icon: 'lock_outline',
            tooltip: 'Presiona este botón para inactivar el registro'
        }
    }

    show: boolean;
    action: string;
    style: string;
    icon?: string;
    label?: string;
    tooltip?: string;

    constructor(show: boolean, icon: string = '', label: string = '', tooltip: string = '') {
        this.show = show;
        this.icon = icon;
        this.label = label;
        this.tooltip = tooltip;
    }
}