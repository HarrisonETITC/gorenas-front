import { FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { AppUtil } from "@gorenas/application-core";

export interface IncorrectDate {
    incorrectDate: { value: string };
}

export function dateValidator(): ValidatorFn {
    return (control: FormControl): ValidationErrors => {
        const invalidDate = AppUtil.verifyEmpty(control.value) || isNaN(new Date(control.value).getTime());

        return invalidDate ? { incorrectDate: { value: control.value } } : null;
    }
}
