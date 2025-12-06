import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthProviders, StorageStrategyProviders } from '@gorenas/data-access-core';
import { ApplicationProviders } from '@gorenas/data-access-core';
import { UtilsProviders } from '@gorenas/data-access-commons';
import { TokenHeaderInterceptor } from '@gorenas/shared-angular';
import { ParseDataInterceptor } from '@gorenas/shared-angular';
import { NotificationProviders } from '@gorenas/ui-commons';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ValidationErrorInterceptor } from '@gorenas/shared-angular';
import {
  PersonProviders,
  PermissionProviders,
  RoleProviders,
  BranchProviders,
  EmployeeProviders
} from '@gorenas/data-access-features';
import { APP_CONFIG_PROVIDERS } from './config/app.config';
import { SaleProviders } from 'libs/data-access/features/src/lib/providers/sale.providers';
import { UserProviders } from 'libs/data-access/features/src/lib/providers/user.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([TokenHeaderInterceptor, ParseDataInterceptor, ValidationErrorInterceptor])
    ),
    ...APP_CONFIG_PROVIDERS,
    ...StorageStrategyProviders,
    ...UtilsProviders,
    ...AuthProviders,
    ...ApplicationProviders,
    ...PersonProviders,
    ...PermissionProviders,
    ...UserProviders,
    ...BranchProviders,
    ...SaleProviders,
    ...EmployeeProviders,
    ...RoleProviders,
    ...NotificationProviders
  ]
};
