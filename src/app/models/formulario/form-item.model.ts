import { BehaviorSubject, Observable } from "rxjs";

export type nombreValor = {
    valor: any,
    nombre: string
}

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
    opciones?: Array<{ valor: string, nombre: string }>;
    dataAutocomplete?: Observable<Array<nombreValor>>;
    autocompleteHandler?: BehaviorSubject<string>;
    activarPanel: boolean = false;
    valorAutoComplete: nombreValor;

    constructor(id: string, tipo: string, label: string, icono: string, opciones?: Array<nombreValor>, dataAutocomplete?: Observable<Array<nombreValor>>, autocompleteHandler?: BehaviorSubject<string>) {
        this.id = id;
        this.tipo = tipo;
        this.label = label;
        this.icono = icono;
        this.opciones = opciones;
        this.dataAutocomplete = dataAutocomplete;
        this.autocompleteHandler = autocompleteHandler;
    }
}