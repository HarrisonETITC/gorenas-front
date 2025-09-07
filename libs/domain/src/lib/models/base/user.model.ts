import { GeneralModel } from "./general.model";
import { StateModel } from "./state.model";

export class UserModel extends GeneralModel implements StateModel {
    email?: string;
    password?: string;
    state?: string;
    created?: Date;
}