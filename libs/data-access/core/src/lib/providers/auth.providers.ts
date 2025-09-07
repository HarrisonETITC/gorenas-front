import { Provider } from "@angular/core";
import { AuthServiceAdapter } from "../adapters/auth-adapter.service";
import { AUTH_SERVICE } from "@gorenas/application-core";

export const AuthProviders: Array<Provider> = [
    {
        provide: AUTH_SERVICE,
        useClass: AuthServiceAdapter
    }
]
