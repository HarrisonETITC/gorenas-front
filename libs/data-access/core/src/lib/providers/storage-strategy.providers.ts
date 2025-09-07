import { StoragePort, STORAGE_TYPE_TOKEN, STORAGE_PROVIDER } from "@gorenas/application-core";
import { StorageContext } from "../strategies/context/storage.context";

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
