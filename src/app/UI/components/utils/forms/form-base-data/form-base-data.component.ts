import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FIELDS_SERVICE, FORM_DATA_SERVICE } from '@Application/config/providers/form.providers';
import { FormDataServicePort } from '@Application/ports/forms/form-data-service.port';
import { AppUtil } from '@utils/app.util';
import { FormBaseComponent } from '../form-base/form-base.component';
import { concatMap, map, Observable, of, Subscription, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormDataConfig } from '@Domain/models/forms/form-data-config.model';
import { FormsUtil } from '@utils/forms.util';
import { FieldsServicePort } from '@Application/ports/forms/fields-service.port';

@Component({
  selector: 'app-form-base-data',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, FormBaseComponent, AsyncPipe],
  templateUrl: './form-base-data.component.html',
  styleUrl: './form-base-data.component.css'
})
export class FormBaseDataComponent<T> implements OnInit, OnDestroy {
  @Input({ transform: (id: string) => +id }) id: number;
  protected forms: Array<FormDataConfig>;
  protected actualForm: FormDataConfig;
  protected actualFormIndex: number = NaN;
  private formsSub: Subscription;

  constructor(
    @Inject(FORM_DATA_SERVICE)
    private readonly formDataService: FormDataServicePort,
    @Inject(FIELDS_SERVICE)
    private readonly fieldsService: FieldsServicePort,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.formsSub = this.formDataService.getForms().pipe(
      tap(forms => {
        this.forms = forms;
        this.actualFormIndex = 0;
        this.initForm();
      })
    ).subscribe();
  }
  initForm() {
    if (AppUtil.verifyEmpty(this.forms)) return;

    this.actualForm = this.forms[this.actualFormIndex];

    if (AppUtil.verifyEmpty(this.id))
      this.fieldsService.updateFields(this.actualForm.fields);
    else {
      this.actualForm.dataInitializer.getById(this.id).pipe(
        tap(data => {
          FormsUtil.assignValuesOnFields(data, this.actualForm.fields)
        })
      ).subscribe(() => this.fieldsService.updateFields(this.actualForm.fields));
    }
  }
  ngOnDestroy() {
    this.formsSub?.unsubscribe();
  }
  goBack() {
    const returnRoute = AppUtil.verifyEmpty(this.id) ? '../' : '../../';

    this.formDataService.updateState(false);
    this.router.navigate([returnRoute], { relativeTo: this.route });
  }
}
