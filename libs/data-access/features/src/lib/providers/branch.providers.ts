import { InjectionToken, Provider } from "@angular/core";
import { BranchServiceAdapter } from "../adapters/branch-adapter.service";
import { ApiServicePort } from "@gorenas/application-core";
import { BranchModel, BranchModelView } from "@gorenas/domain";

export const BRANCH_SERVICE = new InjectionToken<ApiServicePort<BranchModel, BranchModelView>>('BranchService');

export const BranchProviders: Array<Provider> = [
    {
        provide: BRANCH_SERVICE,
        useClass: BranchServiceAdapter
    }
]
