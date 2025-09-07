import { Observable } from "rxjs";

export interface FormCloseComponentPort {
    preCloseComponent(): void;
    closeConfirm(): Observable<boolean>;
    getReturnRoute(): string;
    closeConfirmed(): void;
    closeCanceled(): void;
}