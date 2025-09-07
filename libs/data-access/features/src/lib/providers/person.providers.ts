import { InjectionToken, Provider } from "@angular/core";
import { PersonServiceAdapter } from "@gorenas/data-access-features";
import { ApiServicePort, PersonPort } from "@gorenas/application-core";
import { PersonModel, PersonModelView } from "@gorenas/domain";

export const PERSON_SERVICE = new InjectionToken<ApiServicePort<PersonModel, PersonModelView> & PersonPort>('PersonService');

export const PersonProviders: Array<Provider> = [
    {
        provide: PERSON_SERVICE,
        useClass: PersonServiceAdapter
    }
]
