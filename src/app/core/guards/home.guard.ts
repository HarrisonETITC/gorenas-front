import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { map } from 'rxjs';

export const homeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AUTH_SERVICE);
  const router: Router = inject(Router);

  return authService.isLoggedIn().pipe(
    map((loged) => {
      if (loged) return router.createUrlTree([`/app/dashboard`]);

      return true;
    })
  );
};
