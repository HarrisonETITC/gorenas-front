import { GeneralModel } from "../general/general.model";

export class BranchModelView extends GeneralModel {
    name: string;
    address: string;
    state: string;
    earnings: number;
    created: Date;
    restaurantName: string;
}