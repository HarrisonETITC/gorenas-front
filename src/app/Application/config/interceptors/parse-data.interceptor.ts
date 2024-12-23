import { HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from "@angular/common/http";
import { AppUtil } from "@utils/app.util";
import { Observable, map } from "rxjs";

export const ParseDataInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    return next(req).pipe(
        map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (!AppUtil.verifyEmpty(body) && !AppUtil.verifyEmptySimple(body.data))
                    return event.clone({ body: body.data });
            }

            return event;
        })
    );
}