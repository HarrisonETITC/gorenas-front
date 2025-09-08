import { Injectable } from "@angular/core";
import { StoragePort } from "@gorenas/application-core";
import { StorageTypes } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";

@Injectable()
export class LocalSessionStorageAdapter implements StoragePort {
    private manager!: Storage;

    private static instace: LocalSessionStorageAdapter;

    public static getInstance(type?: string): LocalSessionStorageAdapter {
        if (AppUtil.verifyEmpty(this.instace)) {
            if (AppUtil.verifyEmpty(type))
                throw new Error(`Se requiere del tipo de almacenamiento para inicializar esta clase.`)

            this.instace = new LocalSessionStorageAdapter();
            this.instace.setStorage(type || '');
        }

        return this.instace;
    }

    getItem<T>(key: string): T {
        const item = this.manager.getItem(key);
        if (AppUtil.verifyEmpty(item)) {
            return null as any;
        }
        try {
            return JSON.parse(item!);
        } catch (error) {
            console.error(`Error parsing stored item with key "${key}":`, error);
            return null as any;
        }
    }
    setItem<T>(key: string, value: T): void {
        this.manager.setItem(key, JSON.stringify(value));
    }
    removeItem(key: string): void {
        this.manager.removeItem(key);
    }
    removeGetItem<T>(key: string): T {
        const val = this.getItem<T>(key);
        this.manager.removeItem(key);
        return val;
    }
    clear(): void {
        this.manager.clear();
    }
    getLenght(): number {
        return this.manager.length;
    }

    private setStorage(type: string): void {
        if (type == StorageTypes.LOCAL)
            this.manager = localStorage;
        else if (type == StorageTypes.SESSION)
            this.manager = sessionStorage;
        else
            throw new Error(`Tipo de almacenamiento '${type}' no soportado.`)
    }

}