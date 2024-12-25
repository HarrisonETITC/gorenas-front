import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthProviders } from '@Application/config/providers/auth.providers';
import { ApplicationProviders } from '@Application/config/providers/app.providers';
import { TokenHeaderInterceptor } from '@Application/config/interceptors/token-header.interceptor';
import { PersonProviders } from '@Application/config/providers/person.providers';
import { ParseDataInterceptor } from '@Application/config/interceptors/parse-data.interceptor';
import { NotificationProviders } from '@Application/config/providers/notification.providers';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ValidationErrorInterceptor } from '@Application/config/interceptors/validation-error.interceptor';
import { PermissionProviders } from '@Application/config/providers/permission.providers';
import { FormsProviders } from '@Application/config/providers/form.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([TokenHeaderInterceptor, ParseDataInterceptor, ValidationErrorInterceptor])
    ),
    ...AuthProviders,
    ...ApplicationProviders,
    ...PersonProviders,
    ...PermissionProviders,
    ...FormsProviders,
    ...NotificationProviders
  ]
};
