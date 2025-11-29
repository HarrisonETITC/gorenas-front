import { Observable } from "rxjs";
import { GetAvailablePort } from "../../../ports/get-available.port";
import { GetIdValueMany } from "../../../ports/get-idvalue-many.port";
import { IdValue } from "../../general/id-value.model";
import { BaseFormItemAdapter } from "./base-form-item.adapter";
import { ValidatorFn } from "@angular/forms";
import { BaseFormItemPort } from "../../../interfaces/base-form-item.port";

export class AutoCompleteFormItem extends BaseFormItemAdapter<IdValue> {
    private _options?: Observable<Array<IdValue>>;
    private _endpoint!: GetAvailablePort & GetIdValueMany;

    constructor(
        name: string,
        label: string,
        endpoint: GetAvailablePort & GetIdValueMany,
        options?: Observable<Array<IdValue>>,
        icon: string = '',
        defaultValue: IdValue = null,
        validators: Array<ValidatorFn> = [],
        active: boolean = false,
        transparent: boolean = false
    ) {
        super(name, BaseFormItemPort.TYPE_AUTO_COMPLETE, label, icon, defaultValue, validators, active, transparent);
        this._endpoint = endpoint;
        this._options = options;
        this.validate();
    }

    get options(): Observable<Array<IdValue>> | undefined {
        return this._options;
    }

    get endpoint(): GetAvailablePort & GetIdValueMany {
        return this._endpoint;
    }

    override validate(): void | never {
        // Llamar validación del padre
        super.validate();
        
        if (!this._endpoint) {
            throw new Error('El endpoint es requerido para AutoCompleteFormItem');
        }
    }
}