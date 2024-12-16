export abstract class StateModel {
    public static readonly STATE_ACTIVE = 'A';
    public static readonly STATE_INACTIVE = 'I';
    public static readonly BASIC_STATES: Array<string> = [];

    static {
        this.BASIC_STATES.push(this.STATE_ACTIVE);
        this.BASIC_STATES.push(this.STATE_INACTIVE);
    }

    state?: string;
}