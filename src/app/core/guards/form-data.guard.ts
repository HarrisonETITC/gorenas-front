import { CanDeactivateFn } from '@angular/router';
import { FormCloseComponent } from '@Domain/models/forms/form-close-component.interface';
import { tap } from 'rxjs';

export const formDataGuard: CanDeactivateFn<FormCloseComponent> = (component) => {
  return component.closeConfirm().pipe(
    tap((res: boolean) => {
      if (res) component.closeConfirmed();
      else component.closeCanceled();
    })
  );
};
