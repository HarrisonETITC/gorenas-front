import { ViewValue } from "@Domain/types/view-value.type";

export class NotificationButton {
    static readonly ACCEPT_RESPONSE = 'accept';
    static readonly CANCEL_RESPONSE = 'cancer';

    option: ViewValue;
    icon?: string;
    filled?: boolean;
    outlined?: boolean;
}