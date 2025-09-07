import { Provider } from "@angular/core";
import { ApplicationServiceAdapter } from "../adapters/application-adapter.service";
import { APPLICATION_SERVICE } from "@gorenas/application-core";

export const ApplicationProviders: Array<Provider> = [
    {
        provide: APPLICATION_SERVICE,
        useClass: ApplicationServiceAdapter
    }
]
