import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationConfig } from '@Domain/models/notification-config.type';
import { AppUtil } from '@utils/app.util';

@Component({
  selector: 'app-notification',
  imports: [MatSnackBarModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationComponent {
  protected showList: boolean = false;
  protected list: Array<string>;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: NotificationConfig,
    public snackBarRef: MatSnackBarRef<NotificationComponent>
  ) {
    this.showList = (!AppUtil.verifyEmpty(this.data.extraData) && !AppUtil.verifyEmpty(this.data.extraData.dataList));
    if (this.showList)
      this.list = this.data.extraData.dataList;
  }

  dismissNotification() {
    this.snackBarRef.dismiss();
  }

}
