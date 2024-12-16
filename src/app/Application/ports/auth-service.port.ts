import { LoginModel } from "@Domain/models/general/login.model";
import { UserModelView } from "@Domain/models/model-view/user.mv";
import { Observable } from "rxjs";

export interface AuthServicePort {
    login(credentials: LoginModel): Observable<void>;
    loginInProcess(): Observable<boolean>;
    isLoggedIn(): Observable<boolean>;
    getUser(): Observable<UserModelView>;
    getTokenExcludedEndpoints(): Array<string>;
}