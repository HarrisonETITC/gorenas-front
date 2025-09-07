import { API_URL_TOKEN, STORAGE_TYPE_TOKEN } from '@gorenas/application-core';
import { Provider } from '@angular/core';

export const APP_CONFIG_PROVIDERS: Provider[] = [
  {
    provide: API_URL_TOKEN,
    useValue: 'http://localhost:3000/api'
  },
  {
    provide: STORAGE_TYPE_TOKEN,
    useValue: 'local'
  }
];
