import { FormItem } from "@models/formulario/form-item.model";
import { Subscription } from "rxjs";

export interface GenerarCampoAutoComplete {
    generarAutoComplete(nombre: string, mostrar: string, icono: string): {item: FormItem, sub: Subscription};
}