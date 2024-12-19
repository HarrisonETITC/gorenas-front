import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GenericFormComponent } from '@components/utils/genericform/genericform.component';
import { TableComponent } from '@components/utils/table/table.component';
import { FormConfig } from '@models/formulario/form-config.model';
import { FormItem } from '@models/formulario/form-item.model';
import { RolModel } from '@models/rol.model';
import { UsuarioSendData } from '@models/sendData/usuario.senddata';
import { Usuario } from '@models/usuario.model';
import { LoginService } from '@services/login.service';
import { PersonasService } from '@services/personas.service';
import { AppUtil } from '@utils/app.util';
import { FormsUtil } from '@utils/forms.util';
import { concatMap, EMPTY, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, TableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [LoginService, PersonasService]
})
export class UsuariosComponent implements OnInit {
  usuarios$: Observable<Array<Usuario>>;
  columnas$: Observable<Array<string>>;
  mapeos = Usuario.mapeoCols;
  @ViewChild(TableComponent) tabla: TableComponent<Usuario>;

  formUsuario = new FormGroup({
    email: new FormControl<string>('', [Validators.required]),
    pass: new FormControl<string>('', [Validators.required]),
    oldPass: new FormControl<string>('')
  })
  formUsuarioCampos: Array<FormItem>;
  puedeAgregar = [RolModel.ROL_ADMINISTRADOR, RolModel.ROL_PROPIETARIO, RolModel.ROL_GERENTE].includes(sessionStorage.getItem('rol'));

  constructor(
    private readonly loginService: LoginService,
    private readonly personaService: PersonasService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscarSucursales();
    this.columnas$ = this.usuarios$.pipe(
      map(suc => { return suc.length > 0 ? Object.keys(suc[0]) : [] })
    );
    this.iniciarCamposFormulario();
  }

  buscarSucursales() {
    this.usuarios$ = this.loginService.getUsuarios();
  }

  iniciarCamposFormulario() {
    this.formUsuarioCampos = [
      new FormItem('email', FormItem.TIPO_TEXT, 'Dirección de email', 'mail-outline'),
      new FormItem('pass', FormItem.TIPO_PASSWORD, 'Contraseña', 'lock-closed-outline'),
      new FormItem('oldPass', FormItem.TIPO_PASSWORD, 'Nueva contraseña', 'lock-closed-outline'),
    ]
  }

  abrirFormulario(data?: Usuario) {
    const titulo = !AppUtil.verificarVacio(data) ? 'Editar' : 'Registrar';
    this.dialog.open(GenericFormComponent, {
      data: { form: this.formUsuario, campos: this.formUsuarioCampos, config: new FormConfig(`${titulo} Usuario`, titulo), servicio: this.personaService, editar: !AppUtil.verificarVacio(data) }
    });

    this.personaService.getNotificador().pipe(
      concatMap((val) => {
        if (val == 'Guardar') {
          const nuevoUsuario: UsuarioSendData = FormsUtil.convertirFormObjeto(this.formUsuario, this.formUsuarioCampos);
          return this.loginService.crearUsuario(nuevoUsuario);
        }

        if (val == 'Editar') {
          const editar: UsuarioSendData = FormsUtil.convertirFormObjeto(this.formUsuario, this.formUsuarioCampos, data.id);
          return this.loginService.editarUsuario(editar);
        }

        return EMPTY
      }),
      concatMap((valor) => {
        if (!AppUtil.verificarVacio(valor))
          return this.loginService.getUsuarios()

        return EMPTY
      }),
      tap((lista) => {
        if (!AppUtil.verificarVacio(lista)) {
          this.tabla.refrescarManual(lista);
          this.dialog.closeAll();
        }
      })
    ).subscribe({
      next: () => this.personaService.notificarTerminado(),
      error: (err: HttpErrorResponse) => {
        alert(err.error.message);

        this.personaService.notificarTerminado();
      }
    })
  }

  editarRegistro(registro: Usuario) {
    this.loginService.buscarPorId(registro.id).pipe(
      tap((user) => {
        FormsUtil.llenarFormConCampos(this.formUsuario, this.formUsuarioCampos, user);
        this.abrirFormulario(registro)
      })
    ).subscribe()
  }
}
