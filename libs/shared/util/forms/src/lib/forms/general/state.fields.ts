import { Validators } from "@angular/forms";
import { AppUtil } from "@gorenas/application-core";
import { SelectFormItem, StateModel } from "@gorenas/domain";

export const StateField = new SelectFormItem(
    'state',
    'Estado',
    AppUtil.getViewValuesFromMap(StateModel.STATES_NAMES),
    'shield',
    null,
    [Validators.required]
);