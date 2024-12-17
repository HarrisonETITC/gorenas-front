import { BasicNotificationConfig } from "./basic-notification-config.interface";
import { NotificationData } from "./notification-data.type";

export interface NotificationConfig extends BasicNotificationConfig {
    type: 'success' | 'error' | 'warning' | 'info';
    icon?: string;
    duration?: number;
    extraData?: NotificationData;
}
