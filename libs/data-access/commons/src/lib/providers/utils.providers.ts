import { InjectionToken, Provider } from "@angular/core";
import { PaginatorServiceAdapter } from "../adapters/paginator-adapter.service";
import { PaginatorServicePort } from "@gorenas/application-core";

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
