import { InjectionToken, Provider } from "@angular/core";
import { ApplicationServiceAdapter } from "../adapters/application-adapter.service";
import { ApplicationServicePort } from "@gorenas/application-core";

export const APPLICATION_SERVICE = new InjectionToken<ApplicationServicePort>('ApplicationService');

export const ApplicationProviders: Array<Provider> = [
    {
        provide: APPLICATION_SERVICE,
        useClass: ApplicationServiceAdapter
    }
]
