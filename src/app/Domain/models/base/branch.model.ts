import { GeneralModel } from "../general/general.model";
import { StateModel } from "../general/state.model";

export class BranchModel extends GeneralModel implements StateModel {
    state?: string;
    name?: string;
    address?: string;
    earnings?: number;
    created?: Date;
    modified?: Date;
}