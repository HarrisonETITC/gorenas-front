import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '@services/login.service';
import { FormsUtil } from '@utils/forms.util';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormgenericoComponent } from '@components/utils/formgenerico.component';

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
  })

  constructor(
    private readonly loginService: LoginService,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.procesandoLogin$ = this.loginService.getProcesando();
  }

  ingresar() {
    if (this.loginForm.valid) {
      const usuario = this.loginForm.controls.username.value;
      const contra = this.loginForm.controls.password.value;

      this.loginService.iniciarSesion(usuario, contra).subscribe({
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

  abrirModal() {
    this.dialog.open(FormgenericoComponent);
  }

}
