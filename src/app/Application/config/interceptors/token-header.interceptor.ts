import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AUTH_SERVICE } from "../providers/auth.providers";

export const TokenHeaderInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AUTH_SERVICE);
    const excludePutToken: boolean = req.url.split('/').some(segment => authService.getTokenExcludedEndpoints().includes(segment));

    return next(req);
}