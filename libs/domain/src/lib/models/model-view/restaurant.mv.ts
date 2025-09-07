import { GeneralModel } from "../base/general.model";

export class RestaurantModelView extends GeneralModel {
    name?: string;
    address?: string;
    branches?: number;
}