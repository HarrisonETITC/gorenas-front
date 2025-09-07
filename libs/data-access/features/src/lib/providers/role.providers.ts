import { Provider } from "@angular/core";
import { RoleServiceAdapter } from "../adapters/roles-adapter.service";
import { ROLE_SERVICE } from "@gorenas/application-core";

export const RoleProviders: Array<Provider> = [
    {
        provide: ROLE_SERVICE,
        useClass: RoleServiceAdapter
    }
]
