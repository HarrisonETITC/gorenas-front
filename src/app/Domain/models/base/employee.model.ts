import { GeneralModel } from "../general/general.model";
import { StateModel } from "../general/state.model";

export class EmployeeModel extends GeneralModel implements StateModel {
    salary?: number;
    state?: string;
}