export abstract class StorageServicePort {
    protected manager: Storage;

    constructor(manager: Storage) {
        this.manager = manager;
    }

    abstract getItem<T>(key: string): T;
    abstract setItem<T>(key: string, value: T): void;
    abstract removeItem(key: string): void;
    abstract removeGetItem<T>(key: string): T;
    abstract key(index: number): string;
    abstract clear(): void;
    abstract getLenght(): number;
}
