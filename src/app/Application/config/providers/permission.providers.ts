import { InjectionToken, Provider } from "@angular/core";
import { PermissionServiceAdapter } from "@Application/adapters/services/permission-adapter.service";
import { ApiServicePort } from "@Application/ports/api-service.port";
import { PermissionModel } from "@Domain/models/base/permission.model";
import { PermissionModelView } from "@Domain/models/model-view/permission.mv";

export const PERMISSION_SERVICE = new InjectionToken<ApiServicePort<PermissionModel, PermissionModelView>>('PermissionService');

export const PermissionProviders: Array<Provider> = [
    {
        provide: PERMISSION_SERVICE,
        useClass: PermissionServiceAdapter
    }
]
