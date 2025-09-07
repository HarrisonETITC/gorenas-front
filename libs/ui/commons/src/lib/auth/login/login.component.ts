import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router';
import { FormsUtil } from '@gorenas/shared-util-forms';
import { Observable, Subscription } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AUTH_SERVICE } from '@gorenas/application-core';
import { 
  AuthServicePort, 
  NOTIFICATION_SERVICE, 
  NotificationServicePort, 
  ErrorConfig, 
  InfoConfig, 
  WarningConfig 
} from '@gorenas/application-core';
import { TextComponent } from '@gorenas/ui-controls';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, MatDialogModule, MatIconModule, TextComponent],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit, OnDestroy {
  procesandoLogin$: Observable<boolean>;
  verContra: boolean = false;
  loginForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.maxLength(40)])
  });
  subs: Array<Subscription> = [];

  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationServicePort,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.procesandoLogin$ = this.authService.loginInProcess();
    this.subs.push(
      this.authService.isLoggedIn().subscribe((val) => {
        if (val) {
          this.router.navigate([`/app/dashboard`])
          this.notificationService.showNotification(InfoConfig('Bienvenido', 'Ha iniciado sesión correctamente'))
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ingresar() {
    if (this.loginForm.valid) {
      const username = this.loginForm.controls.username.value;
      const password = this.loginForm.controls.password.value;

      this.authService.login({ username, password }).subscribe({
        error: (err) => {
          this.notificationService.showNotification(WarningConfig('Alerta', err.message));
        },
      });
    } else {
      this.notificationService.showNotification(ErrorConfig('Alerta', 'Hay errores en el formulario'))
    }
  }

  errorCampo(campo: string): string {
    return FormsUtil.errorMessage(this.loginForm, campo);
  }

  tieneError(campo: string): boolean {
    return FormsUtil.hasError(this.loginForm, campo);
  }

}
