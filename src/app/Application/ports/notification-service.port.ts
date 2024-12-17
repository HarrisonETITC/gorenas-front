import { NotificationConfig } from "@Domain/models/notification-config.type";
import { NotificationData } from "@Domain/models/notification-data.type";

export interface NotificationServicePort {
    showNotification(config: NotificationConfig, data?: NotificationData): void;
    closeNotification(): void;
}