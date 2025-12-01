import { GetAvailablePort } from "../../../ports/get-available.port";
import { GetIdValueMany } from "../../../ports/get-idvalue-many.port";
import { IdValue } from "../../general/id-value.model";
import { BehaviorSubject, Observable } from "rxjs";

/**
 * Store global de Subjects para autocomplete.
 * Permite compartir el mismo Subject entre diferentes instancias/copias del campo.
 */
const AUTOCOMPLETE_SUBJECTS_STORE = new Map<string, BehaviorSubject<Array<IdValue>>>();

export class AutocompleteOptions {
    private _fieldId?: string;
    options?: Observable<Array<IdValue>>;
    endpoint!: GetAvailablePort & GetIdValueMany;

    /**
     * Inicializa el Subject usando un store global para garantizar que 
     * todas las copias del campo usen el mismo Subject.
     */
    initOptionsSubject(fieldId?: string): BehaviorSubject<Array<IdValue>> {
        const id = fieldId || this._fieldId || `autocomplete_${Date.now()}_${Math.random()}`;
        this._fieldId = id;

        if (!AUTOCOMPLETE_SUBJECTS_STORE.has(id)) {
            AUTOCOMPLETE_SUBJECTS_STORE.set(id, new BehaviorSubject<Array<IdValue>>([]));
            console.log(`[AutocompleteOptions] Subject creado para: ${id}`);
        }
        
        this.options = AUTOCOMPLETE_SUBJECTS_STORE.get(id)!.asObservable();
        return AUTOCOMPLETE_SUBJECTS_STORE.get(id)!;
    }

    /**
     * Actualiza las opciones emitiendo un nuevo valor.
     * Usa el store global para garantizar que se actualice el Subject correcto.
     */
    updateOptions(options: Array<IdValue>): void {
        console.log('[AutocompleteOptions] updateOptions llamado con:', options?.length, 'opciones, fieldId:', this._fieldId);
        
        if (this._fieldId && AUTOCOMPLETE_SUBJECTS_STORE.has(this._fieldId)) {
            AUTOCOMPLETE_SUBJECTS_STORE.get(this._fieldId)!.next(options);
            console.log('[AutocompleteOptions] Valor emitido en Subject global');
        } else {
            console.error('[AutocompleteOptions] No hay Subject registrado para:', this._fieldId);
        }
    }

    /**
     * Establece el ID del campo para vincular con el store global
     */
    setFieldId(id: string): void {
        this._fieldId = id;
    }

    /**
     * Obtiene el ID del campo
     */
    getFieldId(): string | undefined {
        return this._fieldId;
    }

    /**
     * Limpia el Subject del store global (usar al destruir componentes)
     */
    static clearSubject(fieldId: string): void {
        if (AUTOCOMPLETE_SUBJECTS_STORE.has(fieldId)) {
            AUTOCOMPLETE_SUBJECTS_STORE.delete(fieldId);
        }
    }

    /**
     * Limpia todos los Subjects del store global
     */
    static clearAllSubjects(): void {
        AUTOCOMPLETE_SUBJECTS_STORE.clear();
    }
}
