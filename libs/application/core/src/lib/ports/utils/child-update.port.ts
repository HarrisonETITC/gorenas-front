import { ChangeDetectorRef } from "@angular/core";

export interface ChildUpdatePort {
    firstLoad: boolean;
    cdr: ChangeDetectorRef;
}