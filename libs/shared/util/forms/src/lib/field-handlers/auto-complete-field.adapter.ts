import { AutocompleteFieldPort } from "@gorenas/application-core";
import { AutocompleteOptions, FormItemModel } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, take, tap } from "rxjs";
import { FieldInitializerPort } from "@gorenas/application-core";

export class AutocompleteFieldAdapter implements FieldInitializerPort, AutocompleteFieldPort {
    validateField(field: FormItemModel): void {
        // Validación más flexible - solo advertir en consola si falta el endpoint
        if (AppUtil.verifyEmpty(field.autocompleteOptions)) {
            console.warn(`Campo autocomplete '${field.name}' sin autocompleteOptions configuradas. Se inicializará con valores vacíos.`);
        } else if (AppUtil.verifyEmpty(field.autocompleteOptions?.endpoint)) {
            console.warn(`Campo autocomplete '${field.name}' sin endpoint configurado. El autocompletado no funcionará correctamente.`);
        }
    }
    initField(field: FormItemModel): void {
        // Inicializar autocompleteOptions si no existe
        if (AppUtil.verifyEmpty(field.autocompleteOptions)) {
            field.autocompleteOptions = new AutocompleteOptions();
            field.autocompleteOptions.endpoint = null as any;
        }
        
        // Asegurar que sea una instancia de AutocompleteOptions para tener los métodos
        const currentOptions = field.autocompleteOptions as AutocompleteOptions;
        if (currentOptions && typeof currentOptions.initOptionsSubject !== 'function') {
            // Es un objeto plano, necesita ser convertido a instancia
            const endpoint = currentOptions.endpoint;
            const newOptions = new AutocompleteOptions();
            newOptions.endpoint = endpoint;
            field.autocompleteOptions = newOptions;
        }
        
        // Establecer el fieldId y inicializar el Subject usando el store global
        const autocompleteOpts = field.autocompleteOptions as AutocompleteOptions;
        if (autocompleteOpts && typeof autocompleteOpts.setFieldId === 'function') {
            autocompleteOpts.setFieldId(field.name);
            autocompleteOpts.initOptionsSubject(field.name);
            console.log(`[AutocompleteAdapter] Campo inicializado: ${field.name}`);
        }
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
            debounceTime(300),        // Espera 300ms después de que el usuario deje de escribir
            distinctUntilChanged(),    // Ignora si el valor es igual al anterior
            filter(query => query !== undefined) // Ignora valores undefined
        )
            .subscribe(query => this.initAutoCompleteData(field, query));
    }
    setValue(val: any, field: FormItemModel) {
        // Verificar que existe el endpoint antes de usarlo
        if (AppUtil.verifyEmpty(field.autocompleteOptions?.endpoint)) {
            field.defaultValue = val;
            return of(undefined);
        }
        
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
        // Verificar que existe el endpoint antes de usarlo
        if (!AppUtil.verifyEmpty(field.autocompleteOptions?.endpoint)) {
            console.log(`[AutocompleteAdapter] Buscando: "${query}" para campo: ${field.name}`);
            
            // Asegurar que el autocompleteOptions tenga el fieldId configurado
            const autocompleteOpts = field.autocompleteOptions as AutocompleteOptions;
            if (autocompleteOpts && typeof autocompleteOpts.setFieldId === 'function' && !autocompleteOpts.getFieldId()) {
                autocompleteOpts.setFieldId(field.name);
                autocompleteOpts.initOptionsSubject(field.name);
            }
            
            // Hacer la petición HTTP y actualizar las opciones a través del Subject
            field.autocompleteOptions.endpoint.getAvailable(query).pipe(
                take(1)
            ).subscribe(options => {
                console.log(`[AutocompleteAdapter] Opciones recibidas para ${field.name}:`, options);
                if (autocompleteOpts && typeof autocompleteOpts.updateOptions === 'function') {
                    autocompleteOpts.updateOptions(options);
                    console.log(`[AutocompleteAdapter] Opciones actualizadas en Subject`);
                } else {
                    console.error(`[AutocompleteAdapter] No se pudo actualizar - autocompleteOptions no es instancia válida`);
                }
            });
        } else {
            console.warn(`[AutocompleteAdapter] No hay endpoint configurado para campo: ${field.name}`);
        }
    }
}