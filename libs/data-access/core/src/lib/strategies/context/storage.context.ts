import { StoragePort } from "@gorenas/application-core";
import { StorageTypes } from "@gorenas/domain";
import { LocalSessionStorageAdapter } from "../LocalSessionStorage.strategy";

export const StorageContext = (type: string): StoragePort => {
    if ([StorageTypes.LOCAL, StorageTypes.SESSION].includes(type))
        return LocalSessionStorageAdapter.getInstance(type);

    return null;
}