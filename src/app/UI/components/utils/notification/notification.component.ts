import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NOTIFICATION_SERVICE } from '@Application/config/providers/notification.providers';
import { NotificationServicePort } from '@Application/ports/notification-service.port';
import { NotificationConfig } from '@Domain/models/notification-config.type';
import { NotificationButton } from '@models/menu/notification-button.model';
import { AppUtil } from '@utils/app.util';

@Component({
  selector: 'app-notification',
  imports: [MatSnackBarModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationComponent implements OnInit {
  protected showList: boolean = false;
  protected list: Array<string>;
  protected config: NotificationConfig;

  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationServicePort,
    @Inject(MAT_SNACK_BAR_DATA)
    public data: NotificationConfig,
    public snackBarRef: MatSnackBarRef<NotificationComponent>
  ) {
    this.showList = (!AppUtil.verifyEmpty(this.data.extraData) && !AppUtil.verifyEmpty(this.data.extraData.dataList));
    if (this.showList)
      this.list = this.data.extraData.dataList;
  }

  ngOnInit(): void {
    this.config = this.data;
  }
  dismissNotification() {
    this.snackBarRef.dismiss();
  }
  protected buttonAction(action: string) {
    this.notificationService.sendButtonsResponse(action);
    this.dismissNotification();
  }
  protected getButtonStyles(button: NotificationButton) {
    if (button.filled)
      return 'filled';
    if (button.outlined)
      return 'outlined';

    return '';
  }
  verifyEmpty(val: any) {
    return AppUtil.verifyEmpty(val);
  }
}
