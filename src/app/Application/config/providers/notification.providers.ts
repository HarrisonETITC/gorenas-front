import { InjectionToken, Provider } from "@angular/core";
import { NotificationServiceAdapter } from "@Application/adapters/services/notification/notification-adapter.service";
import { NotificationServicePort } from "@Application/ports/notification-service.port";

export const NOTIFICATION_SERVICE = new InjectionToken<NotificationServicePort>('NotificationService');

export const NotificationProviders: Array<Provider> = [
    {
        provide: NOTIFICATION_SERVICE,
        useClass: NotificationServiceAdapter
    }
]
