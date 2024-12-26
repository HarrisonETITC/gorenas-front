import { CanDeactivateFn } from '@angular/router';
import { FormBaseDataComponent } from '@components/utils/forms/form-base-data/form-base-data.component';

export const formDataGuard: CanDeactivateFn<FormBaseDataComponent<any>> = (component, currentRoute, currentState, nextState) => {
  return true;
};
