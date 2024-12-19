import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
    private readonly loginService: LoginService,
    private readonly dialog: MatDialog
  ) {

  }
  ngOnInit(): void {
    console.log();
  }
}
