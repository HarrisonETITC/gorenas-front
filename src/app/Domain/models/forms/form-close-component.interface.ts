import { Observable } from "rxjs";

export interface FormCloseComponent {
    preCloseComponent(): void;
    closeConfirm(): Observable<boolean>;
    getReturnRoute(): string;
    closeConfirmed(): void;
    closeCanceled(): void;
}