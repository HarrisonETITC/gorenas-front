import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { NOTIFICATION_SERVICE } from "@gorenas/data-access-commons";
import { HttpErrors } from "@gorenas/domain";
import { AppUtil } from "@gorenas/application-core";
import { ErrorConfig } from "@gorenas/application-core";

export const ValidationErrorInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const notificationService = inject(NOTIFICATION_SERVICE);
    return next(req).pipe(
        catchError((e: HttpErrorResponse) => {
            const responseError = e.error;
            if (responseError.statusCode == HttpStatusCode.NotAcceptable && responseError.error == HttpErrors.VALIDATION && !AppUtil.verifyEmpty(responseError.errors)) {
                notificationService.showNotification(ErrorConfig('Errores de validación', responseError.message), { dataList: responseError.errors })
            }

            return throwError(() => e)
        })
    );
}