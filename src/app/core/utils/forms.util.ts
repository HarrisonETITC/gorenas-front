import { FormGroup } from "@angular/forms";
import { IIdValor } from "@models/base/id-valor.interface";
import { AppUtil } from "@utils/app.util";
import { FieldHandlerPort } from "../interfaces/field-handler.port";
import { AutocompleteFieldAdapter } from "@Application/adapters/field-handlers/auto-complete-field.adapter";
import { SelectFieldAdapter } from "@Application/adapters/field-handlers/select-field.adapter";
import { FormItemModel } from "@Domain/models/forms/form-item.model";
import { FormItem } from "@models/formulario/form-item.model";

export class FormsUtil {
    static readonly FORMS_HANDLER = new Map<string, FieldHandlerPort>();

    static {
        FormsUtil.FORMS_HANDLER.set(FormItemModel.TYPE_AUTO_COMPLETE, new AutocompleteFieldAdapter());
        FormsUtil.FORMS_HANDLER.set(FormItemModel.TYPE_SELECT, new SelectFieldAdapter());
    }

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
    static assignValuesOnFields(val: any, fields: Array<FormItemModel>) {
        Object.keys(val).forEach((key) => {
            const value = val[key];
            const field = fields.find(field => field.name === key);
            if (!AppUtil.verifyEmpty(value) && !AppUtil.verifyEmpty(field))
                this.assignValue(value, field);

        })
    }
    static assignValue(val: any, field: FormItemModel) {
        if (field.type === FormItemModel.TYPE_SELECT) {
            field.defaultValue = field.selectOptions?.find((opt) => opt.value == val).viewValue?? '';
            return;
        }

        field.defaultValue = val;
    }

    static convertirFormObjeto<T>(form: FormGroup, campos: Array<FormItem>, id?: number): T {
        const nuevo = {};

        if (!AppUtil.verificarVacio(id))
            nuevo['id'] = id;

        for (const campo of campos) {
            if (campo.tipo === FormItem.TIPO_AUTOCOMPLETE) {
                nuevo[campo.id] = campo.valorAutoComplete?.id ?? null;
                continue;
            }
            nuevo[campo.id] = form.get(campo.id)?.value ?? null;
        }

        return nuevo as T;
    }

    static llenarFormConCampos(group: FormGroup, campos: Array<FormItem>, data: any) {
        for (const campo of campos) {
            if ((campo.tipo != FormItem.TIPO_AUTOCOMPLETE)) {
                group.get(campo.id).setValue(data[campo.id], { emitEvent: false });
            }
        }
    }

    static setValorAutoComplete(form: FormGroup, campos: Array<FormItem>, campoId: string, data: IIdValor) {
        campos.find((val) => val.id == campoId).valorAutoComplete = data;
        form.get(campoId)?.setValue(data.valor);
    }
}