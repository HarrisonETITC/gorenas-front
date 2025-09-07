import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { APPLICATION_SERVICE } from '@gorenas/data-access-core';
import { ApplicationServicePort } from '@gorenas/application-core';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: []
})
export class DashboardComponent {

  constructor(
    @Inject(APPLICATION_SERVICE)
    private readonly appService: ApplicationServicePort
  ) {

  }
}
