import { UserModelView, Menu } from "@gorenas/domain";
import { Observable } from "rxjs";

export interface ApplicationServicePort {
    getUser(): Observable<UserModelView>;
    setActiveComponent(component: string): void;
    activeComponent(): Observable<string>;
    updateActiveComponent(): void;
    getMenu(): Menu;
}