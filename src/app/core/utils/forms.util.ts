import { FormControl, FormGroup } from "@angular/forms";
import { IIdValor } from "@models/base/id-valor.interface";
import { AppUtil } from "@utils/app.util";
import { FieldInitializerPort } from "../interfaces/field-handler.port";
import { AutocompleteFieldAdapter } from "@Application/adapters/field-handlers/auto-complete-field.adapter";
import { SelectFieldAdapter } from "@Application/adapters/field-handlers/select-field.adapter";
import { FormItemModel } from "@Domain/models/forms/items/form-item.model";
import { FormItem } from "@models/formulario/form-item.model";
import { NumberFieldAdapter } from "@Application/adapters/field-handlers/number-field.adapter";

export class FormsUtil {
    static readonly FORMS_HANDLER = new Map<string, FieldInitializerPort>();

    static {
        FormsUtil.FORMS_HANDLER.set(FormItemModel.TYPE_AUTO_COMPLETE, new AutocompleteFieldAdapter());
        FormsUtil.FORMS_HANDLER.set(FormItemModel.TYPE_SELECT, new SelectFieldAdapter());
        FormsUtil.FORMS_HANDLER.set(FormItemModel.TYPE_NUMBER, new NumberFieldAdapter())
    }

    static errorMessage(group: FormGroup, formControl: string, control?: FormControl): string {
        const controlVerify = !AppUtil.verifyEmpty(control) ? control : group.get(formControl);

        if (AppUtil.verificarVacio(controlVerify))
            return "El campo no existe en el formulario";
        if (controlVerify.hasError("required")) {
            return "Este campo es requerido";
        }
        if (controlVerify.hasError("maxlength")) {
            const valor = controlVerify.errors["maxlength"].requiredLength;
            return "Máximo de " + valor + " carácteres";
        }
        if (controlVerify.hasError("minlength")) {
            const valor = controlVerify.errors["minlength"].requiredLength;
            return "Mínimo de " + valor + " carácteres";
        }
        if (controlVerify.hasError("email")) {
            return "Dirección de correo inválida"
        }
        if (controlVerify.hasError("max")) {
            const valor = controlVerify.errors["max"].max;
            return "Valor máximo: " + valor;
        }
        if (controlVerify.hasError("min")) {
            const valor = controlVerify.errors["min"].min;
            return "Valor mínimo: " + valor;
        }
        if (controlVerify.hasError('matchFields')) {
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
            field.defaultValue = field.selectOptions?.options.find((opt) => opt.value == val).viewValue ?? '';
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