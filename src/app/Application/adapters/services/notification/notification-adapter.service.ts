import { inject, Injectable } from "@angular/core";
import { NotificationServicePort } from "@Application/ports/notification-service.port";
import { NotificationConfig } from "@Domain/models/notification-config.type";
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from "@components/utils/notification/notification.component";
import { AppUtil } from "@utils/app.util";
import { NotificationData } from "@Domain/models/notification-data.type";

@Injectable()
export class NotificationServiceAdapter implements NotificationServicePort {
    private readonly snackBar = inject(MatSnackBar)

    showNotification(config: NotificationConfig, data?: NotificationData): void {
        const { title, text, type, icon } = config;
        let { duration } = config;
        if (AppUtil.verifyEmpty(duration))
            duration = 5000;
        this.snackBar.openFromComponent(NotificationComponent, {
            data: {
                title,
                text,
                type,
                icon,
                extraData: data
            },
            verticalPosition: "top",
            horizontalPosition: "right",
            duration,
            panelClass: ['notification-snack-bar-container']
        })
    }
    closeNotification(): void {
        throw new Error("Method not implemented.");
    }

}