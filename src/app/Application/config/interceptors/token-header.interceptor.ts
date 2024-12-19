import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AUTH_SERVICE } from "../providers/auth.providers";
import { Router } from "@angular/router";
import { AppUtil } from "@utils/app.util";

export const TokenHeaderInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AUTH_SERVICE);
    const router = inject(Router);
    const excludePutToken: boolean = req.url.split('/').some(segment => authService.getTokenExcludedEndpoints().includes(segment));

    if (excludePutToken)
        return next(req);

    if (AppUtil.verifyEmpty(authService.getToken())) {
        authService.logout();
        router.navigate(['/home/login']);
    }

    const newReq = authService.setAuthHeader(req);

    return next(newReq);
}