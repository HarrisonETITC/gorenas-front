import { FormControl, FormGroup } from "@angular/forms";
import { AppUtil } from "@gorenas/application-core";
import { FieldInitializerPort } from "@gorenas/application-core";
import { AutocompleteFieldAdapter } from "../field-handlers/auto-complete-field.adapter";
import { SelectFieldAdapter } from "../field-handlers/select-field.adapter";
import { FormItemModel } from "@gorenas/domain";
import { NumberFieldAdapter } from "../field-handlers/number-field.adapter";
import { catchError, forkJoin, from, mergeMap, Observable, of } from "rxjs";

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
    static assignValuesOnFields(val: any, fields: Array<FormItemModel>): Observable<void> {
        const observables = new Array<Observable<void>>();

        console.log('[FormsUtil] assignValuesOnFields - val:', val);
        console.log('[FormsUtil] assignValuesOnFields - fields:', fields.map(f => f.name));

        Object.keys(val).forEach((key) => {
            const value = val[key];
            const field = fields.find(field => field.name === key);
            console.log(`[FormsUtil] Procesando key: ${key}, value:`, value, 'field encontrado:', !!field);
            if (!AppUtil.verifyEmpty(value) && !AppUtil.verifyEmpty(field))
                observables.push(this.assignValue(value, field));
        });

        if (observables.length === 0) {
            return of(undefined);
        }

        return forkJoin(observables).pipe(
            mergeMap(() => of(undefined)),
            catchError(err => {
                console.error('[FormsUtil] Error en assignValuesOnFields:', err);
                return of(undefined);
            })
        );
    }
    static assignValue(val: any, field: FormItemModel): Observable<void> {

        if (this.FORMS_HANDLER.has(field.type)) {
            return this.FORMS_HANDLER.get(field.type).setValue(val, field);
        }

        field.defaultValue = val;
        return of(undefined);
    }

    // static convertirFormObjeto<T>(form: FormGroup, campos: Array<FormItem>, id?: number): T {
    //     const nuevo = {};

    //     if (!AppUtil.verificarVacio(id))
    //         nuevo['id'] = id;

    //     for (const campo of campos) {
    //         if (campo.tipo === FormItem.TIPO_AUTOCOMPLETE) {
    //             nuevo[campo.id] = campo.valorAutoComplete?.id ?? null;
    //             continue;
    //         }
    //         nuevo[campo.id] = form.get(campo.id)?.value ?? null;
    //     }

    //     return nuevo as T;
    // }

    // static llenarFormConCampos(group: FormGroup, campos: Array<FormItem>, data: any) {
    //     for (const campo of campos) {
    //         if ((campo.tipo != FormItem.TIPO_AUTOCOMPLETE)) {
    //             group.get(campo.id).setValue(data[campo.id], { emitEvent: false });
    //         }
    //     }
    // }

    // static setValorAutoComplete(form: FormGroup, campos: Array<FormItem>, campoId: string, data: IIdValor) {
    //     campos.find((val) => val.id == campoId).valorAutoComplete = data;
    //     form.get(campoId)?.setValue(data.valor);
    // }
}