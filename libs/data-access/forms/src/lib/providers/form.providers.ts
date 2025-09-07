import { InjectionToken, Provider } from "@angular/core";
import { FieldsServiceAdapter} from "../adapters/fields-adapter.service";
import { FormDataServiceAdapter } from "../adapters/form-data-adapter.service";
import { FieldsServicePort, FormDataServicePort } from "@gorenas/application-core";

export const FIELDS_SERVICE = new InjectionToken<FieldsServicePort>('FieldsService');
export const FieldsServiceProvier = (): FieldsServicePort => {
    return new FieldsServiceAdapter();
}
export const FORM_DATA_SERVICE = new InjectionToken<FormDataServicePort>('FormDataService');
export const FormDataServiceProvider = (): FormDataServicePort => {
    return new FormDataServiceAdapter();
}

export const FormsProviders: Array<Provider> = [
    {
        provide: FIELDS_SERVICE,
        useFactory: FieldsServiceProvier
    },
    {
        provide: FORM_DATA_SERVICE,
        useFactory: FormDataServiceProvider
    }
]
