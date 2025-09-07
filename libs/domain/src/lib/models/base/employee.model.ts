import { GeneralModel } from "./general.model";
import { StateModel } from "./state.model";

export class EmployeeModel extends GeneralModel implements StateModel {
    salary?: number;
    state?: string;
}