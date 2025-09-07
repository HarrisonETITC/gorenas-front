import { GeneralModel } from "./general.model";
import { StateModel } from "./state.model";

export class BranchModel extends GeneralModel implements StateModel {
    state?: string;
    name?: string;
    address?: string;
    earnings?: number;
    created?: Date;
    modified?: Date;
}