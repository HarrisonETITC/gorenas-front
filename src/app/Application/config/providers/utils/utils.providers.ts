import { InjectionToken, Provider } from "@angular/core";
import { PaginatorServiceAdapter } from "@Application/adapters/services/utils/paginator-adapter.service";
import { PaginatorServicePort } from "@Application/ports/forms/paginator-service.port";

export const PAGINATOR_SERVICE = new InjectionToken<PaginatorServicePort>('PaginatorService');
export const PaginatorServiceProvider = (): PaginatorServicePort => {
    return new PaginatorServiceAdapter();
}

export const UtilsProviders: Array<Provider> = [
    {
        provide: PAGINATOR_SERVICE,
        useFactory: PaginatorServiceProvider
    }
]
