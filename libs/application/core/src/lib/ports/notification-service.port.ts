import { NotificationConfig, NotificationData } from "@gorenas/domain";
import { Observable } from "rxjs";

export interface NotificationServicePort {
    showNotification(config: NotificationConfig, data?: NotificationData): void;
    closeNotification(): void;
    sendButtonsResponse(response: string): void;
    buttonsResponse(): Observable<string>;
}