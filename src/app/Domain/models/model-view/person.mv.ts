import { GeneralModel } from "../general/general.model";

export class PersonModelView extends GeneralModel {
    email: string;
    names: string;
    surnames: string;
    identification: string;
    branch: string;
    role: string;
}