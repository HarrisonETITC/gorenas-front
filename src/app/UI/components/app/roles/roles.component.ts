import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { APPLICATION_SERVICE } from '@Application/config/providers/app.providers';
import { ApplicationServicePort } from '@Application/ports/application-service.port';
import { GenericFormComponent } from '@components/utils/genericform/genericform.component';
import { TableComponent } from '@components/utils/table/table.component';
import { AppModel } from '@Domain/models/base/application.model';
import { FormConfig } from '@models/formulario/form-config.model';
import { FormItem } from '@models/formulario/form-item.model';
import { RolModel } from '@models/rol.model';
import { RolesService } from '@services/roles.service';
import { AppUtil } from '@utils/app.util';
import { FormsUtil } from '@utils/forms.util';
import { concatMap, EMPTY, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
  providers: [RolesService]
})
export class RolesComponent implements OnInit {
  roles$: Observable<Array<RolModel>>;
  columnas$: Observable<Array<string>>;
  mapeos = RolModel.mapeoCols;
  @ViewChild(TableComponent) tabla: TableComponent<RolModel>;

  formRol = new FormGroup({
    nombre: new FormControl<string>('', [Validators.required])
  })
  formRolCampos: Array<FormItem>;
  puedeAgregar = [RolModel.ROL_ADMINISTRADOR, RolModel.ROL_PROPIETARIO, RolModel.ROL_GERENTE].includes(sessionStorage.getItem('rol'));

  constructor(
    private readonly rolService: RolesService,
    private readonly dialog: MatDialog,
    @Inject(APPLICATION_SERVICE)
    private readonly appService: ApplicationServicePort
  ) {
  }
  
  ngOnInit(): void {
    this.buscarSucursales();
    this.columnas$ = this.roles$.pipe(
      map(suc => { return suc.length > 0 ? Object.keys(suc[0]) : [] })
    );
    this.iniciarCamposFormulario();
  }

  buscarSucursales() {
    this.roles$ = this.rolService.getRoles();
  }

  iniciarCamposFormulario() {
    this.formRolCampos = [
      new FormItem('nombre', FormItem.TIPO_TEXT, 'Nombre del rol', 'mail-outline')
    ]
  }

  abrirFormulario(data?: RolModel) {
    const titulo = !AppUtil.verificarVacio(data) ? 'Editar' : 'Registrar';
    this.dialog.open(GenericFormComponent, {
      data: { form: this.formRol, campos: this.formRolCampos, config: new FormConfig(`${titulo} Rol`, titulo), servicio: this.rolService, editar: !AppUtil.verificarVacio(data) }
    });

    this.rolService.getNotificador().pipe(
      concatMap((val) => {
        if (val == 'Guardar') {
          const nuevoRol: RolModel = FormsUtil.convertirFormObjeto(this.formRol, this.formRolCampos);
          return this.rolService.crearRol(nuevoRol);
        }

        if (val == 'Editar') {
          const editar: RolModel = FormsUtil.convertirFormObjeto(this.formRol, this.formRolCampos, data.id);
          return this.rolService.actualizarRol(editar);
        }

        return EMPTY
      }),
      concatMap((valor) => {
        if (!AppUtil.verificarVacio(valor))
          return this.rolService.getRoles()

        return EMPTY
      }),
      tap((lista) => {
        if (!AppUtil.verificarVacio(lista)) {
          this.dialog.closeAll();
        }
      })
    ).subscribe({
      next: () => this.rolService.notificarTerminado(),
      error: (err: HttpErrorResponse) => {
        alert(err.error.message);

        this.rolService.notificarTerminado();
      }
    })
  }

  editarRegistro(registro: RolModel) {
    this.rolService.buscarPorId(registro.id).pipe(
      tap((user) => {
        FormsUtil.llenarFormConCampos(this.formRol, this.formRolCampos, user);
        this.abrirFormulario(registro)
      })
    ).subscribe()
  }
}
