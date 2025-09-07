import { InjectionToken } from '@angular/core';
import { NotificationServicePort } from '../ports/notification-service.port';
import { PaginatorServicePort } from '../ports/forms/paginator-service.port';

// Configuration tokens
export const API_URL_TOKEN = new InjectionToken<string>('API_URL');
export const STORAGE_TYPE_TOKEN = new InjectionToken<string>('STORAGE_TYPE');

// Service tokens
export const NOTIFICATION_SERVICE = new InjectionToken<NotificationServicePort>('NotificationService');
export const PAGINATOR_SERVICE = new InjectionToken<PaginatorServicePort>('PaginatorService');

// Configuration interfaces
export interface AppConfig {
  apiUrl: string;
  storageType: string;
}

export const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>('APP_CONFIG');
