import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URL_AUTH } from "@Application/config/endpoints/general.endpoints";
import { AuthServicePort } from "@Application/ports/auth-service.port";
import { LoginModel } from "@Domain/models/general/login.model";
import { Observable } from "rxjs";
import { apiUrl } from "src/app/environment";

@Injectable()
export class AuthServiceAdapter implements AuthServicePort {
    private readonly baseUrl: string = `${apiUrl}/${URL_AUTH}/`;

    constructor(
        private readonly http: HttpClient
    ) { }

    login(credentials: LoginModel): Observable<void> {
        throw new Error("Method not implemented.");
    }
}