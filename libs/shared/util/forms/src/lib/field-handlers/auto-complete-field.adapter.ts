import { AutocompleteFieldPort } from "@gorenas/application-core";
import { 
    FormField,
    isAutoCompleteFormItem,
    BaseFormItemPort,
    IdValue
} from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, take } from "rxjs";
import { FieldInitializerPort } from "@gorenas/application-core";

export class AutocompleteFieldAdapter implements FieldInitializerPort, AutocompleteFieldPort {
    validateField(field: FormField): void {
        if (!isAutoCompleteFormItem(field)) {
            console.warn(`Campo '${field.name}' no es de tipo AutoCompleteFormItem`);
            return;
        }
        if (AppUtil.verifyEmpty(field.endpoint)) {
            console.warn(`Campo autocomplete '${field.name}' sin endpoint configurado.`);
        }
    }
    initField(field: FormField): void {
        if (!isAutoCompleteFormItem(field)) {
            return;
        }
        field.initOptionsSubject();
        console.log(`[AutocompleteAdapter] Campo inicializado: ${field.name}`);
    }
    isFieldType(field: FormField): boolean {
        return field.type === BaseFormItemPort.TYPE_AUTO_COMPLETE;
    }
    getExtraFields(field: FormField): Array<FormField> {
        return [];
    }
    processExtraFields(extraFields: Array<FormField>, fields: Array<FormField>) {
        return fields;
    }
    updateAutoCompleteData(queryHandler: Observable<string>, field: FormField) {
        queryHandler.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            filter(query => query !== undefined)
        ).subscribe(query => this.initAutoCompleteData(field, query));
    }
    setValue(val: any, field: FormField) {
        if (!isAutoCompleteFormItem(field)) {
            field.defaultValue = val;
            return of(undefined);
        }
        
        const endpoint = field.endpoint;
        
        // Si el valor es un número (ID), obtener el IdValue correspondiente
        if (typeof val === 'number' && !AppUtil.verifyEmpty(endpoint)) {
            console.log(`[AutocompleteAdapter] setValue - Obteniendo IdValue para ID: ${val}, campo: ${field.name}`);
            
            return endpoint.getIdValueMany([val]).pipe(
                take(1),
                map(idValues => {
                    if (idValues && idValues.length > 0) {
                        field.defaultValue = idValues[0];
                        console.log(`[AutocompleteAdapter] setValue - IdValue obtenido:`, idValues[0]);
                    } else {
                        // Si no se encuentra, crear un IdValue con el ID
                        field.defaultValue = new IdValue(val, String(val));
                        console.warn(`[AutocompleteAdapter] setValue - No se encontró IdValue para ID: ${val}`);
                    }
                    return undefined;
                })
            );
        }
        
        field.defaultValue = val;
        return of(undefined);
    }
    
    private initAutoCompleteData(field: FormField, query?: string) {
        if (!isAutoCompleteFormItem(field)) {
            return;
        }
        
        const endpoint = field.endpoint;
        
        if (!AppUtil.verifyEmpty(endpoint)) {
            console.log(`[AutocompleteAdapter] Buscando: "${query}" para campo: ${field.name}`);
            
            endpoint.getAvailable(query).pipe(
                take(1)
            ).subscribe(options => {
                console.log(`[AutocompleteAdapter] Opciones recibidas para ${field.name}:`, options);
                field.updateOptions(options);
            });
        } else {
            console.warn(`[AutocompleteAdapter] No hay endpoint configurado para campo: ${field.name}`);
        }
    }
}