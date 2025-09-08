import { Provider } from "@angular/core";
import { FormBaseServiceAdapter } from "../adapters/form-base-adapter.service";
import { FormDataServiceAdapter } from "../adapters/form-data-adapter.service";
import {
    FIELDS_SERVICE,
    FormBaseServicePort,
    FORM_DATA_SERVICE,
    FormDataServicePort
} from "@gorenas/application-core";

export const FieldsServiceProvier = (): FormBaseServicePort => {
    return new FormBaseServiceAdapter();
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
