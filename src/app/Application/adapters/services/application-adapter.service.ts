import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AUTH_SERVICE, STORAGE_PROVIDER } from "@Application/config/providers/auth.providers";
import { ApplicationServicePort } from "@Application/ports/application-service.port";
import { AuthServicePort } from "@Application/ports/auth-service.port";
import { StoragePort } from "@Application/ports/storage.port";
import { AppModel } from "@Domain/models/base/application.model";
import { UserModelView } from "@Domain/models/model-view/user.mv";
import { Menu } from "@models/menu/menu.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApplicationServiceAdapter implements ApplicationServicePort {
    private readonly componentHandler: BehaviorSubject<string>;
    private readonly router = inject(Router);

    constructor(
        private readonly http: HttpClient,
        @Inject(STORAGE_PROVIDER)
        private readonly storage: StoragePort,
        @Inject(AUTH_SERVICE)
        private readonly authService: AuthServicePort
    ) {
        const initial = AppModel.MODULES.find(module => this.router.url.includes(module));
        this.componentHandler = new BehaviorSubject(initial);
    }
    
    getUser(): Observable<UserModelView> {
        return this.authService.getUser();
    }
    activeComponent(): Observable<string> {
        return this.componentHandler.asObservable();
    }
    setActiveComponent(component: string): void {
        this.componentHandler.next(component);
    }
    updateActiveComponent(): void {
        const active = AppModel.MODULES.find(module => this.router.url.includes(module));
        this.componentHandler.next(active);
    }
    getMenu(): Menu {
        return Menu.getInstance();
    }
}