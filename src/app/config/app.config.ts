import { API_URL_TOKEN, STORAGE_TYPE_TOKEN } from '@gorenas/application-core';
import { Provider } from '@angular/core';

const localUrl= 'http://localhost:3000';
const productionUrl= 'https://web-22w8kdao0i7q.up-de-fra1-k8s-1.apps.run-on-seenode.com';

export const APP_CONFIG_PROVIDERS: Provider[] = [
  {
    provide: API_URL_TOKEN,
    useValue: `${productionUrl}/api`
  },
  {
    provide: STORAGE_TYPE_TOKEN,
    useValue: 'local'
  }
];
