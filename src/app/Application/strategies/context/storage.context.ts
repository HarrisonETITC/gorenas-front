import { StoragePort } from "@Application/ports/storage.port";
import { StorageTypes } from "@Domain/constants/storage.constants";
import { LocalSessionStorageAdapter } from "../LocalSessionStorage.strategy";

export const StorageContext = (type: string): StoragePort => {
    if ([StorageTypes.LOCAL, StorageTypes.SESSION].includes(type))
        return LocalSessionStorageAdapter.getInstance(type);

    return null;
}