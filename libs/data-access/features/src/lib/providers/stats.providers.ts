import { Provider } from '@angular/core';
import { STATS_SERVICE } from '@gorenas/application-core';
import { StatsServiceAdapter } from '../adapters/stats-adapter.service';

export const StatsProviders: Array<Provider> = [
    {
        provide: STATS_SERVICE,
        useClass: StatsServiceAdapter
    }
];
