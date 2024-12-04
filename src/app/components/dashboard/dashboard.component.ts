import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormgenericoComponent } from '@components/utils/formgenerico.component';
import { TableComponent } from '@components/utils/table.component';
import { FormConfig } from '@models/formulario/form-config.model';
import { FormItem } from '@models/formulario/form-item.model';
import { Usuario } from '@models/usuario.model';
import { LoginService } from '@services/login.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [TableComponent, ReactiveFormsModule, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [LoginService]
})
export class DashboardComponent implements OnInit {
  manejadorAutocomplete: BehaviorSubject<string> = new BehaviorSubject<string>('');
  usuariosDisponibles: BehaviorSubject<Array<Usuario>> = new BehaviorSubject<Array<Usuario>>([]);

  registrarseFormCampos: Array<FormItem>;

  registrarseForm = new FormGroup({
    nombres: new FormControl<string>('', [Validators.required]),
    apellidos: new FormControl<string>('', [Validators.required]),
    usuario: new FormControl<string>('', [Validators.required]),
    tipoIdentificacion: new FormControl<string>('', [Validators.required]),
    identificacion: new FormControl<string>('', [Validators.required]),
    telefono: new FormControl<string>(''),
    direccion: new FormControl<string>(''),
    rh: new FormControl<string>(''),
    fechaNacimiento: new FormControl<Date>(null)
  })

  subs: Array<Subscription> = [];

  constructor(
    private readonly loginService: LoginService,
    private readonly dialog: MatDialog
  ) {

  }
  ngOnInit(): void {
    this.iniciarRegistrarForm();
  }

  iniciarRegistrarForm() {
    const campoUsuarios = this.loginService.generarAutoComplete('usuario', 'Usuario asignado', '',);
    this.subs.push(campoUsuarios.sub);
    this.registrarseFormCampos = [
      new FormItem('nombres', FormItem.TIPO_TEXT, 'Nombres', ''),
      new FormItem('apellidos', FormItem.TIPO_TEXT, 'Apellidos', ''),
      campoUsuarios.item,
      new FormItem('tipoIdentificacion', FormItem.TIPO_SELECT, 'Tipo de documento', '', Array.from([
        {
          nombre: '',
          valor: ''
        },
        {
          nombre: 'Cédula de ciudadanía',
          valor: 'C.C'
        },
        {
          nombre: 'Tarjeta de indentidad',
          valor: 'T.I'
        },
        {
          nombre: 'Cedula de extranjería',
          valor: 'C.E'
        }
      ])),
      new FormItem('identificacion', FormItem.TIPO_TEXT, 'Número de identificación', ''),
      new FormItem('telefono', FormItem.TIPO_TEXT, 'Telefono', ''),
      new FormItem('direccion', FormItem.TIPO_TEXT, 'Dirección', ''),
      new FormItem('rh', FormItem.TIPO_TEXT, 'Tipo de sangre', ''),
      new FormItem('fechaNacimiento', FormItem.TIPO_TEXT, 'Fecha de nacimiento', '')
    ]
  }

  abrirModal() {
    this.dialog.open(FormgenericoComponent, {
      data: { form: this.registrarseForm, campos: this.registrarseFormCampos, config: new FormConfig('Registrar Persona', 'Registrar') }
    });
  }
}
