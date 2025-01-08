import { StateStyle } from "@Domain/types/state-style.type";

export abstract class StateModel {
    public static readonly STATE_ACTIVE = 'A';
    public static readonly STATE_INACTIVE = 'I';
    public static readonly BASIC_STATES: Array<string> = [];
    public static readonly STATES_MAP = new Map<string, StateStyle>();

    static {
        this.BASIC_STATES.push(this.STATE_ACTIVE);
        this.BASIC_STATES.push(this.STATE_INACTIVE);
        this.STATES_MAP.set(this.STATE_ACTIVE, new StateStyle('Activo', 'active'));
        this.STATES_MAP.set(this.STATE_INACTIVE, new StateStyle('Inactivo', 'disabled'));
    }

    state?: string;
}