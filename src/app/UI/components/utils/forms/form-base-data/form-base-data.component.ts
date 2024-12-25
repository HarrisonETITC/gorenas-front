import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FORM_DATA_SERVICE } from '@Application/config/providers/form.providers';
import { FormDataServicePort } from '@Application/ports/forms/form-data-service.port';

@Component({
  selector: 'app-form-base-data',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './form-base-data.component.html',
  styleUrl: './form-base-data.component.css'
})
export class FormBaseDataComponent {
  constructor(
    @Inject(FORM_DATA_SERVICE)
    private readonly formDataService: FormDataServicePort,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  goBack() {
    this.formDataService.updateState(false);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
