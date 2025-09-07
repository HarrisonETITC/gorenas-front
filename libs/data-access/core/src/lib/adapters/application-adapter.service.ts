import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  ApplicationServicePort,
  AuthServicePort,
  StoragePort,
  STORAGE_PROVIDER,
  AUTH_SERVICE
} from "@gorenas/application-core";
import {
  AppModel,
  UserModelView,
  Menu
} from "@gorenas/domain";
import {
  BehaviorSubject,
  Observable
} from "rxjs";

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