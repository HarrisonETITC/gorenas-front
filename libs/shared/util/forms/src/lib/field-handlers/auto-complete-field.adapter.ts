import { AutocompleteFieldPort } from "@gorenas/application-core";
import { FormItemModel } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { distinctUntilChanged, filter, map, Observable, of, take, tap, throttleTime } from "rxjs";
import { FieldInitializerPort } from "@gorenas/application-core";

export class AutocompleteFieldAdapter implements FieldInitializerPort, AutocompleteFieldPort {
    validateField(field: FormItemModel): void {
        if (AppUtil.verifyEmpty(field.autocompleteOptions))
            throw new Error(`Debe proveer las opciones de autoComplete para un campo de tipo AutoComplete. Nombre del campo sin opciones: '${field.name}'`);

        if (AppUtil.verifyEmpty(field.autocompleteOptions?.endpoint))
            throw new Error(`Debe proveer un servicio para filtrar las opciones del campo autocomplete. Nombre del campo sin servicio: '${field.name}'`);
    }
    initField(field: FormItemModel): void {
        if (AppUtil.verifyEmpty(field.autocompleteOptions?.options))
            field.autocompleteOptions.options = of([]);
    }
    isFieldType(field: FormItemModel): boolean {
        return field.type === FormItemModel.TYPE_AUTO_COMPLETE;
    }
    getExtraFields(field: FormItemModel): Array<FormItemModel> {
        return [];
    }
    processExtraFields(extraFields: Array<FormItemModel>, fields: Array<FormItemModel>) {
        return fields;
    }
    updateAutoCompleteData(queryHandler: Observable<string>, field: FormItemModel) {
        queryHandler.pipe(
            throttleTime(400, undefined, { leading: true, trailing: true }),
            distinctUntilChanged()
        )
            .subscribe(query => this.initAutoCompleteData(field, query));
    }
    setValue(val: any, field: FormItemModel) {
        return field.autocompleteOptions.endpoint.getIdValueMany([val]).pipe(
            filter(data => !AppUtil.verifyEmptySimple(data)),
            tap(data => {
                if (AppUtil.verifyEmpty(data))
                    field.defaultValue = '';
                else
                    field.defaultValue = data[0];
            }),
            take(1),
            map(_ => { return })
        );
    }
    private initAutoCompleteData(field: FormItemModel, query?: string) {
        field.autocompleteOptions.options = field.autocompleteOptions.endpoint.getAvailable(query);
    }
}