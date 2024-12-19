import { GeneralModel } from "../general/general.model";

export class SaleModelView extends GeneralModel {
    amount: number;
    employee: string;
    branch: string;
    method: string;
    created: Date;
}