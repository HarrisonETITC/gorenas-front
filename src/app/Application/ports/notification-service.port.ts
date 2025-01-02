import { NotificationConfig } from "@Domain/models/notification-config.type";
import { NotificationData } from "@Domain/models/notification-data.type";
import { Observable } from "rxjs";

export interface NotificationServicePort {
    showNotification(config: NotificationConfig, data?: NotificationData): void;
    closeNotification(): void;
    sendButtonsResponse(response: string): void;
    buttonsResponse(): Observable<string>;
}