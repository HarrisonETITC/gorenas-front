import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '@services/login.service';
import { map } from 'rxjs';

export const appGuard: CanActivateFn = (route, state) => {
  const loginService: LoginService = inject(LoginService);
  const router: Router = inject(Router);

  return loginService.getLogeado().pipe(
    map((logeado) => {
      if (!logeado) return router.createUrlTree([`/home/login`]);
      return true
    })
  )
};
