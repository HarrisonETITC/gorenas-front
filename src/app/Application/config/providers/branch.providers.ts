import { InjectionToken, Provider } from "@angular/core";
import { BranchServiceAdapter } from "@Application/adapters/services/branch-adapter.service";
import { ApiServicePort } from "@Application/ports/api-service.port";
import { BranchModel } from "@Domain/models/base/branch.model";
import { BranchModelView } from "@Domain/models/model-view/branch.mv";

export const BRANCH_SERVICE = new InjectionToken<ApiServicePort<BranchModel, BranchModelView>>('BranchService');

export const BranchProviders: Array<Provider> = [
    {
        provide: BRANCH_SERVICE,
        useClass: BranchServiceAdapter
    }
]
