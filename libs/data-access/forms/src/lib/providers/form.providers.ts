import { Provider } from "@angular/core";
import { FieldsServiceAdapter } from "../adapters/fields-adapter.service";
import { FormDataServiceAdapter } from "../adapters/form-data-adapter.service";
import {
    FIELDS_SERVICE,
    FieldsServicePort,
    FORM_DATA_SERVICE,
    FormDataServicePort
} from "@gorenas/application-core";

export const FieldsServiceProvier = (): FieldsServicePort => {
    return new FieldsServiceAdapter();
}
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
