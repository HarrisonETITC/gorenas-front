import { Provider } from "@angular/core";
import { NotificationAdapter } from "@gorenas/data-access-commons";
import { MaterialNotificationProvider } from "./material-notification.provider";
import { NOTIFICATION_SERVICE } from "@gorenas/application-core";

export const NotificationProviders: Array<Provider> = [
    MaterialNotificationProvider,
    {
        provide: NOTIFICATION_SERVICE,
        useFactory: (uiProvider: MaterialNotificationProvider) => {
            const adapter = new NotificationAdapter();
            adapter.setUIProvider(uiProvider);
            return adapter;
        },
        deps: [MaterialNotificationProvider]
    }
]
