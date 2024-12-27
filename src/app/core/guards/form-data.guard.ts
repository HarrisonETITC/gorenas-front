import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { WarningConfig } from '@Application/adapters/services/notification/notification.configs';
import { NOTIFICATION_SERVICE } from '@Application/config/providers/notification.providers';
import { NotificationServicePort } from '@Application/ports/notification-service.port';
import { FormCloseComponent } from '@Domain/models/forms/form-close-component.interface';
import { NotificationButton } from '@models/menu/notification-button.model';
import { AppUtil } from '@utils/app.util';
import { concatMap, filter, map, of, tap } from 'rxjs';

export const formDataGuard: CanDeactivateFn<FormCloseComponent> = (component) => {
  const notificationService = inject(NOTIFICATION_SERVICE);

  return component.closeConfirm().pipe(
    concatMap((res: boolean) => {
      if (res)
        return of(res);
      else {
        notificationService.sendButtonsResponse('');
        showNotification(notificationService);

        return notificationService.buttonsResponse().pipe(
          filter(res => !AppUtil.verifyEmpty(res)),
          map(res => res === NotificationButton.ACCEPT_RESPONSE)
        );
      }
    }),
    tap((res: boolean) => {
      if (res) component.closeConfirmed();
      else component.closeCanceled();
    })
  );
};

const showNotification = (service: NotificationServicePort) => {
  service.showNotification({
    ...WarningConfig('Pérdida de información', 'Si cierra el formulario va a perder los datos que no haya guardado ¿Desea continuar?'), buttons: [
      {
        option: { value: NotificationButton.ACCEPT_RESPONSE, viewValue: 'Aceptar' },
        icon: 'error_outline',
        filled: true
      },
      {
        option: { value: NotificationButton.CANCEL_RESPONSE, viewValue: 'Cancelar' },
        outlined: true
      }
    ],
    hideDismissButton: true,
    noClose: true
  })
}
