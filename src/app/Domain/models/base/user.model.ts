import { GeneralModel } from "@Domain/models/general/general.model";
import { StateModel } from "../general/state.model";

export class UserModel extends GeneralModel implements StateModel {
    email?: string;
    password?: string;
    state?: string;
    created?: Date;
}