import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { Router } from "@angular/router";
import { AppUtil, AUTH_SERVICE } from "@gorenas/application-core";
import { catchError, switchMap } from "rxjs/operators";

export const TokenHeaderInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AUTH_SERVICE);
    const router = inject(Router);
    const excludePutToken: boolean = req.url.split('/').some(segment => authService.getTokenExcludedEndpoints().includes(segment));

    // Si la URL está en la lista de exclusión, continuar sin token
    if (excludePutToken) {
        return next(req);
    }

    // Si no hay token, hacer logout y redirigir
    if (AppUtil.verifyEmpty(authService.getToken())) {
        authService.logout();
        router.navigate(['/home/login']);
        return throwError(() => new Error('No token available'));
    }

    // Validar el token antes de continuar con la petición
    return authService.validateToken(authService.getToken()).pipe(
        switchMap((isValid: boolean) => {
            if (isValid) {
                // Token válido: agregar header y continuar con la petición
                const newReq = authService.setAuthHeader(req);
                return next(newReq);
            } else {
                // Token inválido o vencido: hacer logout y redirigir
                authService.logout();
                router.navigate(['/home/login']);
                return throwError(() => new Error('Token expired or invalid'));
            }
        }),
        catchError((error) => {
            // Error al validar token: hacer logout y redirigir
            authService.logout();
            router.navigate(['/home/login']);
            return throwError(() => error);
        })
    );
}