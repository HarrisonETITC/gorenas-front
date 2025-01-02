import { inject, Injectable } from "@angular/core";
import { NotificationServicePort } from "@Application/ports/notification-service.port";
import { NotificationConfig } from "@Domain/models/notification-config.type";
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from "@components/utils/notification/notification.component";
import { AppUtil } from "@utils/app.util";
import { NotificationData } from "@Domain/models/notification-data.type";
import { BehaviorSubject, Observable, of } from "rxjs";

@Injectable()
export class NotificationServiceAdapter implements NotificationServicePort {
    private readonly snackBar = inject(MatSnackBar);
    private readonly buttonsAction = new BehaviorSubject<string>('');
    private actualConfig: NotificationConfig;

    showNotification(config: NotificationConfig, data?: NotificationData): void {
        this.actualConfig = config;
        const { title, text, type, icon } = config;
        let { duration } = config;
        if (AppUtil.verifyEmpty(duration))
            duration = 5000;

        const dialogConfig = {
            data: {
                title,
                text,
                type,
                icon,
                extraData: data,
                buttons: config.buttons,
                hideDismissButton: config.hideDismissButton
            },
            duration,
            verticalPosition: "top",
            horizontalPosition: "right",
            panelClass: ['notification-snack-bar-container']
        }

        if (config.noClose)
            delete dialogConfig.duration;

        this.snackBar.openFromComponent(NotificationComponent, (dialogConfig as any))
    }
    closeNotification(): void {
        throw new Error("Method not implemented.");
    }
    sendButtonsResponse(response: string): void {
        this.buttonsAction.next(response);
    }
    buttonsResponse(): Observable<string> {
        if (AppUtil.verifyEmpty(this.actualConfig) || AppUtil.verifyEmpty(this.actualConfig.buttons))
            return of('');

        return this.buttonsAction.asObservable();
    }

}