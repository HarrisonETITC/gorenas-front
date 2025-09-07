import { InjectionToken, Provider } from "@angular/core";
import { RoleServiceAdapter } from "../adapters/roles-adapter.service";
import { ApiServicePort } from "@gorenas/application-core";
import { RoleModel, RoleModelView } from "@gorenas/domain";

export const ROLE_SERVICE = new InjectionToken<ApiServicePort<RoleModel, RoleModelView>>('RoleService');

export const RoleProviders: Array<Provider> = [
    {
        provide: ROLE_SERVICE,
        useClass: RoleServiceAdapter
    }
]
