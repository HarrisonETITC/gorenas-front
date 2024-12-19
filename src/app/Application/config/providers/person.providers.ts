import { InjectionToken, Provider } from "@angular/core";
import { PersonServiceAdapter } from "@Application/adapters/services/person-adapter.service";
import { ApiServicePort } from "@Application/ports/api-service.port";
import { PersonPort } from "@Application/ports/person.port";
import { PersonModel } from "@Domain/models/base/person.model";
import { PersonModelView } from "@Domain/models/model-view/person.mv";

export const PERSON_SERVICE = new InjectionToken<ApiServicePort<PersonModel, PersonModelView> & PersonPort>('PersonService');

export const PersonProviders: Array<Provider> = [
    {
        provide: PERSON_SERVICE,
        useClass: PersonServiceAdapter
    }
]
