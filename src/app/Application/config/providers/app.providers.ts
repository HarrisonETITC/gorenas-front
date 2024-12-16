import { InjectionToken, Provider } from "@angular/core";
import { ApplicationServiceAdapter } from "@Application/adapters/services/application-adapter.service";
import { ApplicationServicePort } from "@Application/ports/application-service.port";

export const APPLICATION_SERVICE = new InjectionToken<ApplicationServicePort>('ApplicationService');

export const ApplicationProviders: Array<Provider> = [
    {
        provide: APPLICATION_SERVICE,
        useClass: ApplicationServiceAdapter
    }
]
