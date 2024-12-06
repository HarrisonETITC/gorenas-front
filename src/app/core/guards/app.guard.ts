import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '@services/login.service';
import { AuthUtils } from '@utils/auth.util';
import { map } from 'rxjs';

export const appGuard: CanActivateFn = (route, state) => {
  const loginService: LoginService = inject(LoginService);
  const router: Router = inject(Router);

  return loginService.getLogeado().pipe(
    map((logeado) => {
      const url = state.url;
      const lastSegment = url.split('/').pop();

      if (!logeado || !AuthUtils.verificarPuedeVer(lastSegment)) return router.createUrlTree([`/home/login`]);
      return true
    })
  )
};
