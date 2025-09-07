import { Observable } from "rxjs";
import { HttpRequest } from "@angular/common/http";
import { LoginModel, UserModelView } from "@gorenas/domain";

export interface AuthServicePort {
    login(credentials: LoginModel): Observable<void>;
    logout(): void;
    loginInProcess(): Observable<boolean>;
    isLoggedIn(): Observable<boolean>;
    getUser(): Observable<UserModelView>;
    getTokenExcludedEndpoints(): Array<string>;
    setAuthHeader(req: HttpRequest<any>): HttpRequest<any>;
    getToken(): string;
    userHasRole(acceptedRoles: Array<string>): Observable<boolean>;
    userHasPermission(permission: string): Observable<boolean>;
}