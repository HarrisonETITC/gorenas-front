import { InjectionToken, inject } from "@angular/core";
import { StoragePort, STORAGE_TYPE_TOKEN } from "@gorenas/application-core";
import { StorageContext } from "../strategies/context/storage.context";

export const STORAGE_PROVIDER = new InjectionToken<StoragePort>('StorageProvider');
export const StorageProvider = (): StoragePort => {
    const storageType = inject(STORAGE_TYPE_TOKEN);
    return StorageContext(storageType);
}

export const StorageStrategyProviders = [
    {
        provide: STORAGE_PROVIDER,
        useFactory: StorageProvider
    }
]
