import { Provider } from "@angular/core";
import { SALE_SERVICE } from "@gorenas/application-core";
import { SaleServiceAdapter } from "../adapters/sale-adapter.service";

export const SaleProviders: Array<Provider> = [
    {
        provide: SALE_SERVICE,
        useClass: SaleServiceAdapter
    }
]