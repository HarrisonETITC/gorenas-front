import { BasicNotificationConfig } from "./basic-notification-config.interface";
import { NotificationData } from "./notification-data.type";
import { NotificationButton } from "@models/menu/notification-button.model";

export interface NotificationConfig extends BasicNotificationConfig {
    type: 'success' | 'error' | 'warning' | 'info';
    icon?: string;
    duration?: number;
    extraData?: NotificationData;
    buttons?: Array<NotificationButton>;
    hideDismissButton?: boolean;
    noClose?: boolean;
}
