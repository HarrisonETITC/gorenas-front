import { InjectionToken, Provider } from "@angular/core";
import { NotificationServiceAdapter } from "../notification-adapter.service";
import { NotificationServicePort } from "@gorenas/application-core";

export const NOTIFICATION_SERVICE = new InjectionToken<NotificationServicePort>('NotificationService');

export const NotificationProviders: Array<Provider> = [
    {
        provide: NOTIFICATION_SERVICE,
        useClass: NotificationServiceAdapter
    }
]
