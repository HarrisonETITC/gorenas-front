import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { APPLICATION_SERVICE } from '@Application/config/providers/app.providers';
import { ApplicationServicePort } from '@Application/ports/application-service.port';
import { LoginService } from '@services/login.service';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [LoginService]
})
export class DashboardComponent {

  constructor(
    @Inject(APPLICATION_SERVICE)
    private readonly appService: ApplicationServicePort
  ) {

  }
}
