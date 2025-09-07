import { InjectionToken } from '@angular/core';

// Configuration tokens
export const API_URL_TOKEN = new InjectionToken<string>('API_URL');
export const STORAGE_TYPE_TOKEN = new InjectionToken<string>('STORAGE_TYPE');

// Configuration interfaces
export interface AppConfig {
  apiUrl: string;
  storageType: string;
}

export const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>('APP_CONFIG');
