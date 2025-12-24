import { API_URL_TOKEN, STORAGE_TYPE_TOKEN } from '@gorenas/application-core';
import { Provider } from '@angular/core';

export const APP_CONFIG_PROVIDERS: Provider[] = [
  {
    provide: API_URL_TOKEN,
    useValue: 'https://web-22w8kdao0i7q.up-de-fra1-k8s-1.apps.run-on-seenode.com/api'
  },
  {
    provide: STORAGE_TYPE_TOKEN,
    useValue: 'local'
  }
];
