export class FormItem {
    public static readonly TIPO_TEXT = 'text';
    public static readonly TIPO_PASSWORD = 'password';
    public static readonly TIPO_SELECT = 'select';
    public static readonly TIPO_AUTOCOMPLETE = 'autocomplete';
    public static readonly TIPO_DATE = 'date';

    id: string;
    tipo: string;
    label: string;
    icono: string;
    opciones?: Array<string>;

    constructor(id: string, tipo: string, label: string, icono: string, opciones?: Array<string>) {
        this.id = id;
        this.tipo = tipo;
        this.label = label;
        this.icono = icono;
        this.opciones = opciones;
    }
}