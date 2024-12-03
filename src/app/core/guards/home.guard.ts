import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '@services/login.service';
import { map } from 'rxjs';

export const homeGuard: CanActivateFn = (route, state) => {
  const loginService: LoginService = inject(LoginService);
  const router: Router = inject(Router);

  return loginService.getLogeado().pipe(
    map((logeado) => {
      if (logeado) return router.createUrlTree([`/app/dashboard`]);

      return true;
    })
  );
};
