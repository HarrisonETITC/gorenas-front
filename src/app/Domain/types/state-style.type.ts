export class StateStyle {
    showValue: string;
    style?: string;

    constructor(showValue: string, style: string = 'default') {
        this.showValue = showValue;
        this.style = style;
    }
}