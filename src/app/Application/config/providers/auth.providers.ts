import { InjectionToken, Provider } from "@angular/core";
import { AuthServiceAdapter } from "@Application/adapters/services/auth-adapter.service";
import { AuthServicePort } from "@Application/ports/auth-service.port";
import { StoragePort } from "@Application/ports/storage.port";
import { StorageContext } from "@Application/strategies/context/storage.context";
import { storageType } from "src/app/environment";

export const STORAGE_PROVIDER = new InjectionToken<StoragePort>('StorageProvider');
export const StorageProvider = (): StoragePort => {
    return StorageContext(storageType);
}

export const AUTH_SERVICE = new InjectionToken<AuthServicePort>('AuthService');

export const AuthProviders: Array<Provider> = [
    {
        provide: STORAGE_PROVIDER,
        useFactory: StorageProvider
    },
    {
        provide: AUTH_SERVICE,
        useClass: AuthServiceAdapter
    }
]
