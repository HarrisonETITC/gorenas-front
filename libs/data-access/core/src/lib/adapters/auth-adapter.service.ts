import { HttpClient, HttpErrorResponse, HttpRequest } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import {
    URL_AUTH,
    URL_AUTHENTICATE,
    URL_ID,
    API_URL_TOKEN,
    URL_USER,
    AuthServicePort,
    StoragePort,
    AppUtil,
    STORAGE_PROVIDER
} from "@gorenas/application-core";
import { LoginModel, UserModelView, AuthResponse } from "@gorenas/domain";
import { BehaviorSubject, catchError, concatMap, ignoreElements, map, Observable, tap, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthServiceAdapter implements AuthServicePort {
    private readonly baseUrl: string;
    private readonly logedManager: BehaviorSubject<boolean>;
    private readonly loginStateManager = new BehaviorSubject<boolean>(false);
    private readonly userManager: BehaviorSubject<UserModelView>;

    constructor(
        private readonly http: HttpClient,
        @Inject(STORAGE_PROVIDER)
        private readonly storage: StoragePort,
        @Inject(API_URL_TOKEN)
        private readonly apiUrl: string
    ) {
        this.baseUrl = `${this.apiUrl}/${URL_AUTH}/`;
        this.logedManager = new BehaviorSubject(!AppUtil.verifyEmpty(this.getToken()));
        this.userManager = new BehaviorSubject(this.storage.getItem('user'));
    }

    login(credentials: LoginModel): Observable<void> {
        this.loginStateManager.next(true);
        return this.http.post<AuthResponse>(`${this.baseUrl}${URL_AUTHENTICATE}`, credentials)
            .pipe(
                concatMap((val: AuthResponse) => {
                    this.storage.setItem<string>('token', val.token);

                    return this.http.get<UserModelView>(`${this.apiUrl}/${URL_USER}/${URL_ID}?id=${val.userId}`)
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
            map(usr => AppUtil.verifyEmpty(acceptedRoles) || acceptedRoles.includes(usr.role))
        );
    }
    userHasPermission(permission: string): Observable<boolean> {
        return this.getUser().pipe(
            map(usr => usr.permissions.includes('*') || usr.permissions.includes(permission))
        )
    }
}