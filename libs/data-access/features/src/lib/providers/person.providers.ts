import { Provider } from "@angular/core";
import { PersonServiceAdapter } from "../adapters/person-adapter.service";
import { PERSON_SERVICE } from "@gorenas/application-core";

export const PersonProviders: Array<Provider> = [
    {
        provide: PERSON_SERVICE,
        useClass: PersonServiceAdapter
    }
]
