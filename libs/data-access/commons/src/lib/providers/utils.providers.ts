import { Provider } from "@angular/core";
import { PaginatorServiceAdapter } from "../adapters/paginator-adapter.service";
import { PaginatorServicePort, PAGINATOR_SERVICE } from "@gorenas/application-core";

export const PaginatorServiceProvider = (): PaginatorServicePort => {
    return new PaginatorServiceAdapter();
}

export const UtilsProviders: Array<Provider> = [
    {
        provide: PAGINATOR_SERVICE,
        useFactory: PaginatorServiceProvider
    }
]
