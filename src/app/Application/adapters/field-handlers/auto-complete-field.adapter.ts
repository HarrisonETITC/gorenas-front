import { AutocompleteFieldPort } from "@Application/ports/forms/auto-complete-field.port";
import { FormItemModel } from "@Domain/models/forms/form-item.model";
import { AppUtil } from "@utils/app.util";
import { distinctUntilChanged, Observable, of, throttleTime } from "rxjs";
import { FieldHandlerPort } from "src/app/core/interfaces/field-handler.port";

export class AutocompleteFieldAdapter implements FieldHandlerPort, AutocompleteFieldPort {
    validateField(field: FormItemModel): void {
        if (AppUtil.verifyEmpty(field.completeOptionsFilter))
            throw new Error(`Debe proveer un servicio para filtrar las opciones del campo autocomplete. Nombre del campo sin servicio: '${field.name}'`);
    }
    initField(field: FormItemModel): void {
        if (AppUtil.verifyEmpty(field.completeOptions))
            field.completeOptions = of([]);
    }
    isFieldType(field: FormItemModel): boolean {
        return field.type === FormItemModel.TYPE_AUTO_COMPLETE;
    }
    updateAutoCompleteData(queryHandler: Observable<string>, field: FormItemModel) {
        queryHandler.pipe(
            throttleTime(400, undefined, { leading: true, trailing: true }),
            distinctUntilChanged()
        )
            .subscribe(query => this.initAutoCompleteData(field, query));
    }
    private initAutoCompleteData(field: FormItemModel, query?: string) {
        field.completeOptions = field.completeOptionsFilter.getAvailable(query);
    }
}