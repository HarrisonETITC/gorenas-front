import { GeneralModel } from "../general/general.model";

export class RoleModelView extends GeneralModel {
    name: string;
    state: string;
    users?: number;
}