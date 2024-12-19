import { GeneralModel } from "../general/general.model";

export class RestaurantModelView extends GeneralModel {
    name?: string;
    address?: string;
    branches?: number;
}