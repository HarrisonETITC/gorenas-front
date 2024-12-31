import { HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from "@angular/common/http";
import { AppUtil } from "@utils/app.util";
import { Observable, filter, map } from "rxjs";

export const ParseDataInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    return next(req).pipe(
        filter(event => event instanceof HttpResponse),
        map((event: HttpResponse<any>) => {
            const body = event.body;
            if (!AppUtil.verifyEmpty(body) && !AppUtil.verifyEmptySimple(body.data))
                return event.clone({ body: body.data });

            return event;
        })
    );
}