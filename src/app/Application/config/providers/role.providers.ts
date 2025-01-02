import { InjectionToken, Provider } from "@angular/core";
import { RoleServiceAdapter } from "@Application/adapters/services/roles-adapter.service";
import { ApiServicePort } from "@Application/ports/api-service.port";
import { RoleModel } from "@Domain/models/base/role.model";
import { RoleModelView } from "@Domain/models/model-view/role.mv";

export const ROLE_SERVICE = new InjectionToken<ApiServicePort<RoleModel, RoleModelView>>('RoleService');

export const RoleProviders: Array<Provider> = [
    {
        provide: ROLE_SERVICE,
        useClass: RoleServiceAdapter
    }
]
