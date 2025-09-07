import { InjectionToken, Provider } from "@angular/core";
import { PermissionServiceAdapter } from "../adapters/permission-adapter.service";
import { ApiServicePort } from "@gorenas/application-core";
import { PermissionModel, PermissionModelView } from "@gorenas/domain";

export const PERMISSION_SERVICE = new InjectionToken<ApiServicePort<PermissionModel, PermissionModelView>>('PermissionService');

export const PermissionProviders: Array<Provider> = [
    {
        provide: PERMISSION_SERVICE,
        useClass: PermissionServiceAdapter
    }
]
