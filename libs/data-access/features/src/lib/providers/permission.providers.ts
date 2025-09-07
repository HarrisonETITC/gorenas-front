import { Provider } from "@angular/core";
import { PermissionServiceAdapter } from "../adapters/permission-adapter.service";
import { PERMISSION_SERVICE } from "@gorenas/application-core";


export const PermissionProviders: Array<Provider> = [
    {
        provide: PERMISSION_SERVICE,
        useClass: PermissionServiceAdapter
    }
]
