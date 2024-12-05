import { IIdValor } from "@models/base/id-valor.interface";
import { BehaviorSubject, Observable } from "rxjs";

export class FormItem {
    public static readonly TIPO_TEXT = 'text';
    public static readonly TIPO_PASSWORD = 'password';
    public static readonly TIPO_SELECT = 'select';
    public static readonly TIPO_AUTOCOMPLETE = 'autocomplete';
    public static readonly TIPO_DATE = 'date';
    public static readonly TIPO_NUMBER = 'number';

    id: string;
    tipo: string;
    label: string;
    icono: string;
    opciones?: Array<IIdValor>;
    dataAutocomplete?: Observable<Array<IIdValor>>;
    autocompleteHandler?: BehaviorSubject<string>;
    activarPanel: boolean = false;
    valorAutoComplete: IIdValor;

    constructor(id: string, tipo: string, label: string, icono: string, opciones?: Array<IIdValor>, dataAutocomplete?: Observable<Array<IIdValor>>, autocompleteHandler?: BehaviorSubject<string>) {
        this.id = id;
        this.tipo = tipo;
        this.label = label;
        this.icono = icono;
        this.opciones = opciones;
        this.dataAutocomplete = dataAutocomplete;
        this.autocompleteHandler = autocompleteHandler;
    }
}