import { GeneralModel } from "../general/general.model";

export class UserModeView extends GeneralModel {
    email: string;
    name: string;
    state: string;
    role: string;
}