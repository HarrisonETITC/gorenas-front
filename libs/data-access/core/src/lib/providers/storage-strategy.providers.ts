import { InjectionToken } from "@angular/core";
import { StoragePort, STORAGE_TYPE_TOKEN } from "@gorenas/application-core";
import { StorageContext } from "../strategies/context/storage.context";

export const STORAGE_PROVIDER = new InjectionToken<StoragePort>('StorageProvider');
export const StorageProvider = (storageType: string): StoragePort => {
    return StorageContext(storageType);
}

export const StorageStrategyProviders = [
    {
        provide: STORAGE_PROVIDER,
        useFactory: StorageProvider,
        deps: [STORAGE_TYPE_TOKEN]
    }
]
