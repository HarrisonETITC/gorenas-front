import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GenericFormComponent } from '@components/utils/genericform/genericform.component';
import { TableComponent } from '@components/utils/table/table.component';
import { FormConfig } from '@models/formulario/form-config.model';
import { FormItem } from '@models/formulario/form-item.model';
import { Persona } from '@models/persona.model';
import { RolModel } from '@models/rol.model';
import { LoginService } from '@services/login.service';
import { CreatePersonaData, PersonasService } from '@services/personas.service';
import { RolesService } from '@services/roles.service';
import { AppUtil } from '@utils/app.util';
import { FormsUtil } from '@utils/forms.util';
import { concatMap, EMPTY, map, Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-persons',
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css',
  providers: [PersonasService, LoginService, RolesService]
})
export class PersonsComponent {

  personas$: Observable<Array<Persona>>;
  columnas$: Observable<Array<string>>;
  mapeos = Persona.mapeoCols;
  @ViewChild(TableComponent) tabla: TableComponent<Persona>;

  personaFormCampos: Array<FormItem>;

  personaForm = new FormGroup({
    nombres: new FormControl<string>('', [Validators.required]),
    apellidos: new FormControl<string>('', [Validators.required]),
    usuarioId: new FormControl<string>('', [Validators.required]),
    rolId: new FormControl<string>('', [Validators.required]),
    tipoId: new FormControl<string>('', [Validators.required]),
    identificacion: new FormControl<string>('', [Validators.required]),
    numContacto: new FormControl<string>(''),
    direccion: new FormControl<string>(''),
    rh: new FormControl<string>('')
  })
  subs: Array<Subscription> = [];
  puedeAgregar = [RolModel.ROL_ADMINISTRADOR, RolModel.ROL_PROPIETARIO, RolModel.ROL_GERENTE].includes(sessionStorage.getItem('rol'));

  constructor(
    private readonly personasService: PersonasService,
    private readonly loginService: LoginService,
    private readonly rolesService: RolesService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscarSucursales();
    this.columnas$ = this.personas$.pipe(
      map(suc => { return suc.length > 0 ? Object.keys(suc[0]) : [] })
    );
    this.iniciarCamposFormulario();
  }

  buscarSucursales() {
    this.personas$ = this.personasService.getPersonas();
  }

  iniciarCamposFormulario() {
    const campoUsuarios = this.loginService.generarAutoComplete('usuarioId', 'Usuario asociado', 'person-circle-outline');
    const campoRoles = this.rolesService.generarAutoComplete('rolId', 'Rol asociado', 'alert-circle-outline');
    this.subs.push(campoUsuarios.sub, campoRoles.sub);
    this.personaFormCampos = [
      new FormItem('nombres', FormItem.TIPO_TEXT, 'Nombres', ''),
      new FormItem('apellidos', FormItem.TIPO_TEXT, 'Apellidos', ''),
      campoUsuarios.item,
      campoRoles.item,
      new FormItem('tipoId', FormItem.TIPO_SELECT, 'Tipo de documento', '', Persona.TIPOS_DOCUMENTO),
      new FormItem('identificacion', FormItem.TIPO_TEXT, 'Número de identificación', ''),
      new FormItem('numContacto', FormItem.TIPO_TEXT, 'Telefono', ''),
      new FormItem('direccion', FormItem.TIPO_TEXT, 'Dirección', ''),
      new FormItem('rh', FormItem.TIPO_SELECT, 'Tipo de sangre', '', Persona.TIPOS_RH)
    ]
  }

  abrirFormulario(data?: Persona) {
    const titulo = !AppUtil.verificarVacio(data) ? 'Editar' : 'Registrar';
    this.dialog.open(GenericFormComponent, {
      data: { form: this.personaForm, campos: this.personaFormCampos, config: new FormConfig(`${titulo} Persona`, titulo), servicio: this.personasService, editar: !AppUtil.verificarVacio(data) }
    });

    this.personasService.getNotificador().pipe(
      concatMap((val) => {
        if (val == 'Guardar') {
          const nuevaPersona: CreatePersonaData = FormsUtil.convertirFormObjeto(this.personaForm, this.personaFormCampos);
          return this.personasService.crearPersona(nuevaPersona);
        }

        if (val == 'Editar') {
          const editado = FormsUtil.convertirFormObjeto<CreatePersonaData>(this.personaForm, this.personaFormCampos, data.id);
          return this.personasService.editarPersona(editado);
        }

        return EMPTY
      }),
      concatMap((valor) => {
        if (!AppUtil.verificarVacio(valor))
          return this.personasService.getPersonas()

        return EMPTY
      }),
      tap((lista) => {
        if (!AppUtil.verificarVacio(lista)) {
          this.dialog.closeAll()
        }
      })
    ).subscribe({
      next: () => this.personasService.notificarTerminado(),
      error: (err: HttpErrorResponse) => {
        alert(err.error.message);
        this.personasService.notificarTerminado();
      }
    })
  }

  editarRegistro(registro: Persona) {
    const sub = this.personasService.getById(registro.id).pipe(
      concatMap((persona) => {
        FormsUtil.llenarFormConCampos(this.personaForm, this.personaFormCampos, persona);

        return this.loginService.getByPersonaId(persona.id);
      }),
      concatMap((usuario) => {
        FormsUtil.setValorAutoComplete(this.personaForm, this.personaFormCampos, 'usuarioId', { id: usuario.id, valor: usuario.email });

        return this.rolesService.getByPersonaId(registro.id);
      }),
      tap((rol) => {
        FormsUtil.setValorAutoComplete(this.personaForm, this.personaFormCampos, 'rolId', { id: rol.id, valor: rol.nombre });

        this.abrirFormulario(registro);
      })
    ).subscribe(() => sub.unsubscribe())
  }
}
