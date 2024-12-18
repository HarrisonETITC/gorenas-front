import { HttpClient, HttpErrorResponse, HttpRequest } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { URL_AUTH, URL_AUTHENTICATE, URL_ID } from "@Application/config/endpoints/general.endpoints";
import { URL_USER } from "@Application/config/endpoints/user.endpoints";
import { STORAGE_PROVIDER } from "@Application/config/providers/auth.providers";
import { AuthServicePort } from "@Application/ports/auth-service.port";
import { StoragePort } from "@Application/ports/storage.port";
import { LoginModel } from "@Domain/models/general/login.model";
import { UserModelView } from "@Domain/models/model-view/user.mv";
import { AuthResponse } from "@Domain/types/auth-response.type";
import { AppUtil } from "@utils/app.util";
import { BehaviorSubject, catchError, concatMap, ignoreElements, map, Observable, tap, throwError } from "rxjs";
import { apiUrl } from "src/app/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthServiceAdapter implements AuthServicePort {
    private readonly baseUrl: string = `${apiUrl}/${URL_AUTH}/`;
    private readonly logedManager: BehaviorSubject<boolean>;
    private readonly loginStateManager = new BehaviorSubject<boolean>(false);
    private readonly userManager: BehaviorSubject<UserModelView>;

    constructor(
        private readonly http: HttpClient,
        @Inject(STORAGE_PROVIDER)
        private readonly storage: StoragePort
    ) {
        this.logedManager = new BehaviorSubject(!AppUtil.verifyEmpty(this.getToken()));
        this.userManager = new BehaviorSubject(this.storage.getItem('user'));
    }

    login(credentials: LoginModel): Observable<void> {
        this.loginStateManager.next(true);
        return this.http.post<AuthResponse>(`${this.baseUrl}${URL_AUTHENTICATE}`, credentials)
            .pipe(
                concatMap((val: AuthResponse) => {
                    this.storage.setItem<string>('token', val.token);

                    return this.http.get<UserModelView>(`${apiUrl}/${URL_USER}/${URL_ID}?id=${val.userId}`)
                }),
                tap((user: UserModelView) => {
                    this.storage.setItem('user', user);
                    this.userManager.next(user);

                    this.loginStateManager.next(false);
                    this.logedManager.next(true);
                }),
                catchError((e: HttpErrorResponse) => {
                    this.logout();
                    return throwError(() => new Error(e.error.message));
                }),
                ignoreElements()
            );
    }
    logout(): void {
        this.storage.clear();
        this.loginStateManager.next(false);
        this.logedManager.next(false);
    }
    isLoggedIn(): Observable<boolean> {
        return this.logedManager.asObservable();
    }
    getUser(): Observable<UserModelView> {
        return this.userManager.asObservable();
    }
    loginInProcess(): Observable<boolean> {
        return this.loginStateManager.asObservable();
    }
    getTokenExcludedEndpoints(): Array<string> {
        return [URL_AUTH, URL_AUTHENTICATE];
    }
    setAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${this.getToken()}`
            }
        });
    }
    getToken(): string {
        return this.storage.getItem('token');
    }
    userHasRole(acceptedRoles: Array<string>): Observable<boolean> {
        return this.getUser().pipe(
            map(usr => acceptedRoles.includes(usr.role))
        );
    }
    userHasPermission(permission: string): Observable<boolean> {
        return this.getUser().pipe(
            map(usr => usr.permissions.includes('*') || usr.permissions.includes(permission))
        )
    }
}