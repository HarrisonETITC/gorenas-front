import { BehaviorSubject, Observable } from "rxjs";
import { GetAvailablePort } from "../../../ports/get-available.port";
import { GetIdValueMany } from "../../../ports/get-idvalue-many.port";
import { IdValue } from "../../general/id-value.model";
import { BaseFormItemAdapter } from "./base-form-item.adapter";
import { ValidatorFn } from "@angular/forms";
import { BaseFormItemPort } from "../../../interfaces/base-form-item.port";

/**
 * Store global de Subjects para autocomplete.
 * Permite compartir el mismo Subject entre diferentes instancias/copias del campo.
 */
const AUTOCOMPLETE_SUBJECTS_STORE = new Map<string, BehaviorSubject<Array<IdValue>>>();

/**
 * Clase específica para campos de tipo Autocomplete.
 * Contiene el endpoint y las opciones directamente como propiedades.
 * 
 * @example
 * ```typescript
 * const roleField = new AutoCompleteFormItem(
 *   'roleId',
 *   'Rol asignado',
 *   roleService, // debe implementar GetAvailablePort & GetIdValueMany
 *   'lock_outline',
 *   null,
 *   [Validators.required]
 * );
 * ```
 */
export class AutoCompleteFormItem extends BaseFormItemAdapter<IdValue> {
    endpoint: GetAvailablePort & GetIdValueMany;
    options$?: Observable<Array<IdValue>>;
    private _fieldId?: string;

    constructor(
        name: string,
        label: string,
        endpoint: GetAvailablePort & GetIdValueMany,
        icon: string = '',
        defaultValue: IdValue = null,
        validators: Array<ValidatorFn> = [],
        active: boolean = false,
        transparent: boolean = false,
        hideOnEdit: boolean = false
    ) {
        super(name, BaseFormItemPort.TYPE_AUTO_COMPLETE, label, icon, defaultValue, validators, active, transparent, hideOnEdit);
        this.endpoint = endpoint;
        this._fieldId = name;
        this.initOptionsSubject();
        this.validate();
    }

    initOptionsSubject(): BehaviorSubject<Array<IdValue>> {
        const id = this._fieldId || `autocomplete_${Date.now()}_${Math.random()}`;
        this._fieldId = id;

        if (!AUTOCOMPLETE_SUBJECTS_STORE.has(id)) {
            AUTOCOMPLETE_SUBJECTS_STORE.set(id, new BehaviorSubject<Array<IdValue>>([]));
        }
        
        this.options$ = AUTOCOMPLETE_SUBJECTS_STORE.get(id)!.asObservable();
        return AUTOCOMPLETE_SUBJECTS_STORE.get(id)!;
    }

    updateOptions(options: Array<IdValue>): void {
        if (this._fieldId && AUTOCOMPLETE_SUBJECTS_STORE.has(this._fieldId)) {
            AUTOCOMPLETE_SUBJECTS_STORE.get(this._fieldId)!.next(options);
        }
    }

    /**
     * Obtiene el ID del campo
     */
    getFieldId(): string | undefined {
        return this._fieldId;
    }

    /**
     * Establece el ID del campo
     */
    setFieldId(id: string): void {
        this._fieldId = id;
    }

    override validate(): void | never {
        super.validate();
        
        // Solo advertir si no hay endpoint - puede ser configurado dinámicamente después
        if (!this.endpoint) {
            console.warn(`Campo autocomplete "${this.name}" creado sin endpoint. Asegúrese de configurarlo antes de usar.`);
        }
    }

    /**
     * Limpia el Subject del store global
     */
    static clearSubject(fieldId: string): void {
        if (AUTOCOMPLETE_SUBJECTS_STORE.has(fieldId)) {
            AUTOCOMPLETE_SUBJECTS_STORE.delete(fieldId);
        }
    }
}