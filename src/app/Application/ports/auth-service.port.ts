import { LoginModel } from "@Domain/models/general/login.model";
import { Observable } from "rxjs";

export interface AuthServicePort {
    login(credentials: LoginModel): Observable<void>;
}