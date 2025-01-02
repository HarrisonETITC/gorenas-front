import { Subject } from "rxjs";

export interface DestroySubsPort {
    finishSubs$: Subject<void>;
    destroySubs(): void;
}