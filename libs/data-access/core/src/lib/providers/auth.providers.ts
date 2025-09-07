import { InjectionToken, Provider } from "@angular/core";
import { AuthServiceAdapter } from "../adapters/auth-adapter.service";
import { AuthServicePort } from "@gorenas/application-core";

export const AUTH_SERVICE = new InjectionToken<AuthServicePort>('AuthService');

export const AuthProviders: Array<Provider> = [
    {
        provide: AUTH_SERVICE,
        useClass: AuthServiceAdapter
    }
]
