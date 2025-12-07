import { AutocompleteFieldPort } from "@gorenas/application-core";
import { 
    AutocompleteOptions, 
    FormItemModel, 
    FormField,
    isAutoCompleteFormItem,
    BaseFormItemPort
} from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, take, tap } from "rxjs";
import { FieldInitializerPort } from "@gorenas/application-core";

export class AutocompleteFieldAdapter implements FieldInitializerPort, AutocompleteFieldPort {
    validateField(field: FormField): void {
        // Para nuevas clases (AutoCompleteFormItem)
        if (isAutoCompleteFormItem(field)) {
            if (AppUtil.verifyEmpty(field.endpoint)) {
                console.warn(`Campo autocomplete '${field.name}' sin endpoint configurado.`);
            }
            return;
        }
        
        // Para clases legacy (FormItemModel)
        const legacyField = field as FormItemModel;
        if (AppUtil.verifyEmpty(legacyField.autocompleteOptions)) {
            console.warn(`Campo autocomplete '${field.name}' sin autocompleteOptions configuradas. Se inicializará con valores vacíos.`);
        } else if (AppUtil.verifyEmpty(legacyField.autocompleteOptions?.endpoint)) {
            console.warn(`Campo autocomplete '${field.name}' sin endpoint configurado. El autocompletado no funcionará correctamente.`);
        }
    }
    initField(field: FormField): void {
        // Para nuevas clases (AutoCompleteFormItem), ya está inicializado en el constructor
        if (isAutoCompleteFormItem(field)) {
            field.initOptionsSubject();
            console.log(`[AutocompleteAdapter] Campo nuevo inicializado: ${field.name}`);
            return;
        }
        
        // Para clases legacy (FormItemModel)
        const legacyField = field as FormItemModel;
        
        // Inicializar autocompleteOptions si no existe
        if (AppUtil.verifyEmpty(legacyField.autocompleteOptions)) {
            legacyField.autocompleteOptions = new AutocompleteOptions();
            legacyField.autocompleteOptions.endpoint = null as any;
        }
        
        // Asegurar que sea una instancia de AutocompleteOptions para tener los métodos
        const currentOptions = legacyField.autocompleteOptions as AutocompleteOptions;
        if (currentOptions && typeof currentOptions.initOptionsSubject !== 'function') {
            // Es un objeto plano, necesita ser convertido a instancia
            const endpoint = currentOptions.endpoint;
            const newOptions = new AutocompleteOptions();
            newOptions.endpoint = endpoint;
            legacyField.autocompleteOptions = newOptions;
        }
        
        // Establecer el fieldId y inicializar el Subject usando el store global
        const autocompleteOpts = legacyField.autocompleteOptions as AutocompleteOptions;
        if (autocompleteOpts && typeof autocompleteOpts.setFieldId === 'function') {
            autocompleteOpts.setFieldId(field.name);
            autocompleteOpts.initOptionsSubject(field.name);
            console.log(`[AutocompleteAdapter] Campo legacy inicializado: ${field.name}`);
        }
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
            debounceTime(300),        // Espera 300ms después de que el usuario deje de escribir
            distinctUntilChanged(),    // Ignora si el valor es igual al anterior
            filter(query => query !== undefined) // Ignora valores undefined
        )
            .subscribe(query => this.initAutoCompleteData(field, query));
    }
    setValue(val: any, field: FormField) {
        // Obtener el endpoint según el tipo de campo
        const endpoint = this.getEndpoint(field);
        
        // Si el valor es un número (ID), necesitamos obtener el IdValue correspondiente
        if (typeof val === 'number' && !AppUtil.verifyEmpty(endpoint)) {
            console.log(`[AutocompleteAdapter] setValue - Obteniendo IdValue para ID: ${val}, campo: ${field.name}`);
            
            return endpoint.getIdValueMany([val]).pipe(
                take(1),
                map(idValues => {
                    if (idValues && idValues.length > 0) {
                        // Asignar el IdValue completo (id + value/nombre)
                        field.defaultValue = idValues[0];
                        console.log(`[AutocompleteAdapter] setValue - IdValue obtenido:`, idValues[0]);
                    } else {
                        // Si no se encuentra, mantener el ID como fallback
                        field.defaultValue = val;
                        console.warn(`[AutocompleteAdapter] setValue - No se encontró IdValue para ID: ${val}`);
                    }
                    return undefined;
                })
            );
        }
        
        // Para otros casos (string, objeto IdValue, etc.), asignar directamente
        field.defaultValue = val;
        return of(undefined);
    }
    
    /**
     * Obtiene el endpoint del campo (funciona con ambos sistemas)
     */
    private getEndpoint(field: FormField) {
        if (isAutoCompleteFormItem(field)) {
            return field.endpoint;
        }
        const legacyField = field as FormItemModel;
        return legacyField.autocompleteOptions?.endpoint;
    }
    
    private initAutoCompleteData(field: FormField, query?: string) {
        const endpoint = this.getEndpoint(field);
        
        // Verificar que existe el endpoint antes de usarlo
        if (!AppUtil.verifyEmpty(endpoint)) {
            console.log(`[AutocompleteAdapter] Buscando: "${query}" para campo: ${field.name}`);
            
            // Hacer la petición HTTP y actualizar las opciones
            endpoint.getAvailable(query).pipe(
                take(1)
            ).subscribe(options => {
                console.log(`[AutocompleteAdapter] Opciones recibidas para ${field.name}:`, options);
                
                // Actualizar opciones según el tipo de campo
                if (isAutoCompleteFormItem(field)) {
                    field.updateOptions(options);
                    console.log(`[AutocompleteAdapter] Opciones actualizadas en nuevo campo`);
                } else {
                    // Para campo legacy
                    const legacyField = field as FormItemModel;
                    const autocompleteOpts = legacyField.autocompleteOptions as AutocompleteOptions;
                    if (autocompleteOpts && typeof autocompleteOpts.updateOptions === 'function') {
                        autocompleteOpts.updateOptions(options);
                        console.log(`[AutocompleteAdapter] Opciones actualizadas en campo legacy`);
                    } else {
                        console.error(`[AutocompleteAdapter] No se pudo actualizar - autocompleteOptions no es instancia válida`);
                    }
                }
            });
        } else {
            console.warn(`[AutocompleteAdapter] No hay endpoint configurado para campo: ${field.name}`);
        }
    }
}