import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthProviders } from '@gorenas/data-access-core';
import { ApplicationProviders } from '@gorenas/data-access-core';
import { TokenHeaderInterceptor } from '@gorenas/shared-angular';
import { ParseDataInterceptor } from '@gorenas/shared-angular';
import { NotificationProviders } from '@gorenas/data-access-commons';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ValidationErrorInterceptor } from '@gorenas/shared-angular';
import {
  PersonProviders,
  PermissionProviders,
  RoleProviders,
  BranchProviders
} from '@gorenas/data-access-features';
import { APP_CONFIG_PROVIDERS } from './config/app.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([TokenHeaderInterceptor, ParseDataInterceptor, ValidationErrorInterceptor])
    ),
    ...APP_CONFIG_PROVIDERS,
    ...AuthProviders,
    ...ApplicationProviders,
    ...PersonProviders,
    ...PermissionProviders,
    ...BranchProviders,
    ...RoleProviders,
    ...NotificationProviders
  ]
};
