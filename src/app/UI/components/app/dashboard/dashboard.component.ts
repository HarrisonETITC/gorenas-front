import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { APPLICATION_SERVICE } from '@Application/config/providers/app.providers';
import { ApplicationServicePort } from '@Application/ports/application-service.port';
import { AppModel } from '@Domain/models/base/application.model';
import { LoginService } from '@services/login.service';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [LoginService]
})
export class DashboardComponent implements OnInit {

  constructor(
    @Inject(APPLICATION_SERVICE)
    private readonly appService: ApplicationServicePort
  ) {

  }
  ngOnInit(): void {
  }
}
