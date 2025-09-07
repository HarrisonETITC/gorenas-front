export interface StoragePort {
    getItem<T>(key: string): T;
    setItem<T>(key: string, value: T): void;
    removeItem(key: string): void;
    removeGetItem<T>(key: string): T;
    clear(): void;
    getLenght(): number;
}