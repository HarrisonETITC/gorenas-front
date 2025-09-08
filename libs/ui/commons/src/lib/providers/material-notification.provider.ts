import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NotificationUIProvider } from "@gorenas/data-access-commons";
import {
  NotificationConfig,
  NotificationData
} from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { NotificationComponent } from "../notification/notification.component";

@Injectable()
export class MaterialNotificationProvider implements NotificationUIProvider {
  private readonly snackBar = inject(MatSnackBar);

  show(config: NotificationConfig, data?: NotificationData): void {
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

    this.snackBar.openFromComponent(NotificationComponent, (dialogConfig as any));
  }

  close(): void {
    this.snackBar.dismiss();
  }
}
