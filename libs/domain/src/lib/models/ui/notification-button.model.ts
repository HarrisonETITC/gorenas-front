import { ViewValue } from "../general/view-value.model";

export class NotificationButton {
    static readonly ACCEPT_RESPONSE = 'accept';
    static readonly CANCEL_RESPONSE = 'cancel';

    option!: ViewValue;
    icon?: string;
    filled?: boolean;
    outlined?: boolean;
}