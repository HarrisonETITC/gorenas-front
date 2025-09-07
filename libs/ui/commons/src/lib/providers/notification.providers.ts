import { Provider } from "@angular/core";
import { NotificationServiceAdapter } from "../notification-adapter.service";
import { NOTIFICATION_SERVICE } from "@gorenas/application-core";

export const NotificationProviders: Array<Provider> = [
    {
        provide: NOTIFICATION_SERVICE,
        useClass: NotificationServiceAdapter
    }
]
