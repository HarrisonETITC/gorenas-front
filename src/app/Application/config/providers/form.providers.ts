import { InjectionToken, Provider } from "@angular/core";
import { FieldsServiceAdapter } from "@Application/adapters/services/forms/fields-adapter.service";
import { FormDataServiceAdapter } from "@Application/adapters/services/forms/form-data-adapter.service";
import { FieldsServicePort } from "@Application/ports/forms/fields-service.port";
import { FormDataServicePort } from "@Application/ports/forms/form-data-service.port";

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
