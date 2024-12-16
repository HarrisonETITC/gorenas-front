import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '@services/login.service';
import { FormsUtil } from '@utils/forms.util';
import { Observable, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { APPLICATION_SERVICE } from '@Application/config/providers/app.providers';
import { ApplicationServicePort } from '@Application/ports/application-service.port';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { AuthServicePort } from '@Application/ports/auth-service.port';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, MatDialogModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  procesandoLogin$: Observable<boolean>;
  verContra: boolean = false;
  loginForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.maxLength(40)])
  });

  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.procesandoLogin$ = this.authService.loginInProcess();
  }

  ingresar() {
    if (this.loginForm.valid) {
      const username = this.loginForm.controls.username.value;
      const password = this.loginForm.controls.password.value;

      this.authService.login({ username, password })
        .subscribe({
          next: (val) => {
            this.router.navigate([`/app/dashboard`])
          },
          error: (err) => {
            alert(err.message)
          }
        });
    } else {
      alert('Hay errores en el formulario')
    }
  }

  errorCampo(campo: string): string {
    return FormsUtil.errorMessage(this.loginForm, campo);
  }

  tieneError(campo: string): boolean {
    return FormsUtil.hasError(this.loginForm, campo);
  }

}
