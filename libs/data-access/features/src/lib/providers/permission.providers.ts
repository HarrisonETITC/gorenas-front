import { InjectionToken, Provider } from "@angular/core";
import { PermissionServiceAdapter } from "@gorenas/data-access-features";
import { ApiServicePort } from "@gorenas/application-core";
import { PermissionModel, PermissionModelView } from "@gorenas/domain";

export const PERMISSION_SERVICE = new InjectionToken<ApiServicePort<PermissionModel, PermissionModelView>>('PermissionService');

export const PermissionProviders: Array<Provider> = [
    {
        provide: PERMISSION_SERVICE,
        useClass: PermissionServiceAdapter
    }
]
