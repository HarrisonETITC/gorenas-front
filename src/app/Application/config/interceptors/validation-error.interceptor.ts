import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { NOTIFICATION_SERVICE } from "../providers/notification.providers";
import { HttpErrors } from "@Domain/constants/http-errors.constants";
import { AppUtil } from "@utils/app.util";
import { ErrorConfig } from "@Application/adapters/services/notification/notification.configs";

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