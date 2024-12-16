import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { URL_AUTH, URL_AUTHENTICATE, URL_ID } from "@Application/config/endpoints/general.endpoints";
import { URL_USER } from "@Application/config/endpoints/user.endpoints";
import { STORAGE_PROVIDER } from "@Application/config/providers/auth.providers";
import { AuthServicePort } from "@Application/ports/auth-service.port";
import { StoragePort } from "@Application/ports/storage.port";
import { LoginModel } from "@Domain/models/general/login.model";
import { UserModelView } from "@Domain/models/model-view/user.mv";
import { AuthResponse } from "@Domain/types/auth-response.type";
import { TokenResponse } from "@Domain/types/token-response.type";
import { BehaviorSubject, catchError, concatMap, ignoreElements, Observable, tap, throwError } from "rxjs";
import { apiUrl } from "src/app/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthServiceAdapter implements AuthServicePort {
    private readonly baseUrl: string = `${apiUrl}/${URL_AUTH}/`;
    private readonly logedManager = new BehaviorSubject<boolean>(false);
    private readonly loginStateManager = new BehaviorSubject<boolean>(false);
    private readonly userManager = new BehaviorSubject<UserModelView>(new UserModelView());

    constructor(
        private readonly http: HttpClient,
        @Inject(STORAGE_PROVIDER)
        private readonly storage: StoragePort
    ) { }

    login(credentials: LoginModel): Observable<void> {
        this.loginStateManager.next(true);
        return this.http.post<AuthResponse>(`${this.baseUrl}${URL_AUTHENTICATE}`, credentials)
            .pipe(
                concatMap((val: AuthResponse) => {
                    this.storage.setItem<string>('token', val.token);
                    this.logedManager.next(true);

                    return this.http.get<UserModelView>(`${apiUrl}/${URL_USER}/${URL_ID}?id=${val.userId}`)
                }),
                tap((user: UserModelView) => {
                    this.storage.setItem('user', user);
                    this.userManager.next(user);

                    this.loginStateManager.next(false);
                }),
                catchError((e: HttpErrorResponse) => {
                    this.loginStateManager.next(false);
                    this.storage.removeItem('token');
                    this.storage.removeItem('user');

                    return throwError(() => new Error(e.error.message));
                }),
                ignoreElements()
            );
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
}