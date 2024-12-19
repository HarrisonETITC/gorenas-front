import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ErrorConfig } from '@Application/adapters/services/notification/notification.configs';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { NOTIFICATION_SERVICE } from '@Application/config/providers/notification.providers';
import { AppUtil } from '@utils/app.util';
import { concatMap, map, of } from 'rxjs';

export const appGuard: CanActivateFn = (route, state) => {
  const authService = inject(AUTH_SERVICE);
  const notifier = inject(NOTIFICATION_SERVICE);
  const router: Router = inject(Router);

  return authService.isLoggedIn().pipe(
    concatMap((loged) => {
      if(!loged)
        return of(false);

      const roles = route.data ? route.data['acceptedRoles'] : [];

      if (AppUtil.verifyEmpty(roles))
        return of(true);

      return authService.userHasRole(roles);
    }),
    map((loged) => {
      if (!loged) {
        notifier.showNotification(ErrorConfig(`No autorizado`, `No tiene permiso para acceder a esta sección`));

        return router.createUrlTree([`/home/login`]);
      }
      return true
    })
  )
};
