import { GeneralModel } from "../general/general.model";

export class UserModelView extends GeneralModel {
    email: string;
    name: string;
    state: string;
    role: string;
}