import { GeneralModel } from "../base/general.model";

export class UserModelView extends GeneralModel {
    email: string;
    name: string;
    state: string;
    role: string;
    permissions: Array<string>;
}