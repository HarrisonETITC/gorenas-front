import { FormGroup } from "@angular/forms";
import { AppUtil } from "@utils/app.util";

export class FormsUtil {
    static errorMessage(group: FormGroup, formControl: string): string {
        const control = group.get(formControl);

        if (AppUtil.verificarVacio(control))
            return "El campo no existe en el formulario";
        if (control.hasError("required")) {
            return "Este campo es requerido";
        }
        if (control.hasError("maxlength")) {
            const valor = control.errors["maxlength"].requiredLength;
            return "Máximo de " + valor + " carácteres";
        }
        if (control.hasError("minlength")) {
            const valor = control.errors["minlength"].requiredLength;
            return "Mínimo de " + valor + " carácteres";
        }
        if (control.hasError("email")) {
            return "Dirección de correo inválida"
        }
        if (control.hasError("max")) {
            const valor = control.errors["max"].max;
            return "Valor máximo: " + valor;
        }
        if (control.hasError("min")) {
            const valor = control.errors["min"].min;
            return "Valor mínimo: " + valor;
        }
        if (control.hasError('matchFields')) {
            return 'Los campos no coinciden';
        }
        return '';
    }

    static hasError(group: FormGroup, formControl: string): boolean {
        return group.get(formControl).invalid && group.get(formControl).touched;
    }
}