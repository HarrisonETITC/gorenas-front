import { Provider } from "@angular/core";
import { BranchServiceAdapter } from "../adapters/branch-adapter.service";
import { BRANCH_SERVICE } from "@gorenas/application-core";

export const BranchProviders: Array<Provider> = [
    {
        provide: BRANCH_SERVICE,
        useClass: BranchServiceAdapter
    }
]
