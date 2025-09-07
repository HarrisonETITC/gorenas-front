import { inject, Injectable } from "@angular/core";
import { NotificationServicePort } from "@gorenas/application-core";
import { NotificationConfig } from "@gorenas/domain";
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from "@gorenas/ui-commons";
import { AppUtil } from "@gorenas/application-core";
import { NotificationData } from "@gorenas/domain";
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