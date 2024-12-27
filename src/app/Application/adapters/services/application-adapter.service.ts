import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { URL_ID } from "@Application/config/endpoints/general.endpoints";
import { URL_USER } from "@Application/config/endpoints/user.endpoints";
import { AUTH_SERVICE, STORAGE_PROVIDER } from "@Application/config/providers/auth.providers";
import { ApplicationServicePort } from "@Application/ports/application-service.port";
import { AuthServicePort } from "@Application/ports/auth-service.port";
import { StoragePort } from "@Application/ports/storage.port";
import { UserModelView } from "@Domain/models/model-view/user.mv";
import { AppUtil } from "@utils/app.util";
import { BehaviorSubject, ignoreElements, Observable, tap } from "rxjs";
import { apiUrl } from "src/app/environment";

@Injectable({
    providedIn: 'root'
})
export class ApplicationServiceAdapter implements ApplicationServicePort {
    private readonly componentHandler = new BehaviorSubject<string>('');

    constructor(
        private readonly http: HttpClient,
        @Inject(STORAGE_PROVIDER)
        private readonly storage: StoragePort,
        @Inject(AUTH_SERVICE)
        private readonly authService: AuthServicePort

    ) { }

    getUser(): Observable<UserModelView> {
        return this.authService.getUser();
    }
    activeComponent(): Observable<string> {
        return this.componentHandler.asObservable();
    }
    setActiveComponent(component: string): void {
        this.componentHandler.next(component);
    }
}