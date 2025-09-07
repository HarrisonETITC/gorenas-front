import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { NOTIFICATION_SERVICE } from '@gorenas/application-core';
import { NotificationButton, ViewValue } from '@gorenas/domain';
import { WarningConfig, NotificationServicePort } from '@gorenas/application-core';
import { FormCloseComponentPort } from '@gorenas/application-core';
import { AppUtil } from '@gorenas/application-core';
import { concatMap, filter, map, of, tap } from 'rxjs';

export const formDataGuard: CanDeactivateFn<FormCloseComponentPort> = (component) => {
  const notificationService = inject(NOTIFICATION_SERVICE);

  return component.closeConfirm().pipe(
    concatMap((res: boolean) => {
      if (res)
        return of(res);

      notificationService.sendButtonsResponse('');
      showNotification(notificationService);

      return notificationService.buttonsResponse().pipe(
        filter(res => !AppUtil.verifyEmpty(res)),
        map(res => res === NotificationButton.ACCEPT_RESPONSE)
      );
    }),
    tap((res: boolean) => {
      if (res) {
        component.closeConfirmed();
        return;
      }

      component.closeCanceled();
    })
  );
};

const showNotification = (service: NotificationServicePort) => {
  service.showNotification({
    ...WarningConfig('Pérdida de información', 'Si cierra el formulario va a perder los datos que no haya guardado ¿Desea continuar?'), buttons: [
      {
        option: new ViewValue(NotificationButton.ACCEPT_RESPONSE, 'Aceptar'),
        icon: 'error_outline',
        filled: true
      },
      {
        option: new ViewValue(NotificationButton.CANCEL_RESPONSE, 'Cancelar'),
        outlined: true
      }
    ],
    hideDismissButton: true,
    noClose: true
  })
}
