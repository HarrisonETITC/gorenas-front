import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { ErrorConfig } from '@Application/adapters/services/notification/notification.configs';
import { APPLICATION_SERVICE } from '@Application/config/providers/app.providers';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { NOTIFICATION_SERVICE } from '@Application/config/providers/notification.providers';
import { AppModel } from '@Domain/models/base/application.model';
import { AppUtil } from '@utils/app.util';
import { concatMap, map, of } from 'rxjs';

export const appGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AUTH_SERVICE);
  const notifier = inject(NOTIFICATION_SERVICE);
  const router: Router = inject(Router);
  const appService = inject(APPLICATION_SERVICE);
  const target: string = route.url.map(segment => segment.path).join('/');
  const notifyChange = AppModel.MODULES.includes(target);

  return authService.isLoggedIn().pipe(
    concatMap((loged) => {
      if (!loged)
        return of(false);

      const roles = route.data ? route.data['acceptedRoles'] : [];

      if (AppUtil.verifyEmpty(roles)) {
        if (notifyChange)
          appService.setActiveComponent(target);

        return of(true);
      }

      return authService.userHasRole(roles);
    }),
    map((loged) => {
      if (!loged) {
        notifier.showNotification(ErrorConfig(`No autorizado`, `No tiene permiso para acceder a esta sección`));

        return router.createUrlTree([`/home/login`]);
      }

      if (notifyChange)
        appService.setActiveComponent(target);
      
      return true
    })
  )
};
