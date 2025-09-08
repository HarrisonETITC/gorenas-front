import { InjectionToken } from '@angular/core';
import { NotificationServicePort } from '../ports/utils/notification-service.port';
import { PaginatorServicePort } from '../ports/forms/paginator-service.port';
import { ApplicationServicePort } from '../ports/general/application-service.port';
import { AuthServicePort } from '../ports/general/auth-service.port';
import { StoragePort } from '../ports/utils/storage.port';
import { ApiServicePort } from '../ports/general/api-service.port';
import { PersonPort } from '../ports/features/person.port';
import {
  BranchModel,
  BranchModelView,
  PermissionModel,
  PermissionModelView,
  PersonModel,
  PersonModelView,
  RoleModel,
  RoleModelView
} from '@gorenas/domain';
import { FormBaseServicePort } from '../ports/forms/form-base-service.port';
import { FormDataServicePort } from '../ports/forms/form-data-service.port';

// Configuration tokens
export const API_URL_TOKEN = new InjectionToken<string>('API_URL');
export const STORAGE_TYPE_TOKEN = new InjectionToken<string>('STORAGE_TYPE');

// Service tokens
export const NOTIFICATION_SERVICE = new InjectionToken<NotificationServicePort>('NotificationService');
export const PAGINATOR_SERVICE = new InjectionToken<PaginatorServicePort>('PaginatorService');
export const APPLICATION_SERVICE = new InjectionToken<ApplicationServicePort>('ApplicationService');
export const AUTH_SERVICE = new InjectionToken<AuthServicePort>('AuthService');
export const STORAGE_PROVIDER = new InjectionToken<StoragePort>('StorageProvider');
export const FIELDS_SERVICE = new InjectionToken<FormBaseServicePort>('FieldsService');
export const FORM_DATA_SERVICE = new InjectionToken<FormDataServicePort>('FormDataService');

// Features
export const BRANCH_SERVICE = new InjectionToken<ApiServicePort<BranchModel, BranchModelView>>('BranchService');
export const PERMISSION_SERVICE = new InjectionToken<ApiServicePort<PermissionModel, PermissionModelView>>('PermissionService');
export const PERSON_SERVICE = new InjectionToken<ApiServicePort<PersonModel, PersonModelView> & PersonPort>('PersonService');
export const ROLE_SERVICE = new InjectionToken<ApiServicePort<RoleModel, RoleModelView>>('RoleService');

// Configuration interfaces
export interface AppConfig {
  apiUrl: string;
  storageType: string;
}

export const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>('APP_CONFIG');
