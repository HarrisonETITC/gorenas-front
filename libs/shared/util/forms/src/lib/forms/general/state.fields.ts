import { Validators } from "@angular/forms";
import { AppUtil } from "@gorenas/application-core";
import { FormItemModel, StateModel, ViewValue } from "@gorenas/domain";

export const StateField: FormItemModel = {
    label: 'Estado del empleado',
    type: FormItemModel.TYPE_SELECT,
    name: 'state',
    icon: 'shield',
    validators: [Validators.required],
    selectOptions: {
        options: AppUtil.getViewValuesFromMap(StateModel.STATES_NAMES)
    }
}