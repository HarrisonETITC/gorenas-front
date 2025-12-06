import { Validators } from "@angular/forms";
import { FormItemModel, StateModel, ViewValue } from "@gorenas/domain";

export const StateField: FormItemModel = {
    label: 'Estado del empleado',
    type: FormItemModel.TYPE_SELECT,
    name: 'state',
    icon: 'shield',
    validators: [Validators.required],
    selectOptions: {
        options: Array.from(StateModel.STATES_NAMES.keys()).map(key => new ViewValue(key, StateModel.STATES_NAMES.get(key)))
    }
}