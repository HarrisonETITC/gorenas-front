import { UserModelView } from "@Domain/models/model-view/user.mv";
import { Observable } from "rxjs";

export interface ApplicationServicePort {
    getUser(): Observable<UserModelView>;
    setActiveComponent(component: string): void;
    activeComponent(): Observable<string>;
    updateActiveComponent(): void;
}