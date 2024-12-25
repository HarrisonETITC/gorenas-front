import { InjectionToken, Provider } from "@angular/core";
import { FieldsServiceAdapter } from "@Application/adapters/services/forms/fields-adapter.service";
import { FieldsServicePort } from "@Application/ports/forms/fields-service.port";

export const FIELDS_SERVICE = new InjectionToken<FieldsServicePort>('FieldsService');
export const FieldsServiceProvier = (): FieldsServicePort => {
    return new FieldsServiceAdapter();
}

export const FormsProviders: Array<Provider> = [
    {
        provide: FIELDS_SERVICE,
        useFactory: FieldsServiceProvier
    }
]
