import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormgenericoComponent } from '@components/utils/formgenerico.component';
import { TableComponent } from '@components/utils/table.component';
import { FormConfig } from '@models/formulario/form-config.model';
import { FormItem } from '@models/formulario/form-item.model';
import { Persona } from '@models/persona.model';
import { LoginService } from '@services/login.service';
import { CreatePersonaData, PersonasService } from '@services/personas.service';
import { RolesService } from '@services/roles.service';
import { AppUtil } from '@utils/app.util';
import { FormsUtil } from '@utils/forms.util';
import { concatMap, EMPTY, map, Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-personas',
  imports: [TableComponent, ReactiveFormsModule, MatDialogModule],
  templateUrl: './personas.component.html',
  styleUrl: './personas.component.css',
  providers: [PersonasService, LoginService, RolesService]
})
export class PersonasComponent {

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
    console.log(Object.keys(new CreatePersonaData()))
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
    this.dialog.open(FormgenericoComponent, {
      data: { form: this.personaForm, campos: this.personaFormCampos, config: new FormConfig(`${titulo} Persona`, titulo), servicio: this.personasService, editar: !AppUtil.verificarVacio(data) }
    });

    const sub = this.personasService.getNotificador().pipe(
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
          this.tabla.refrescarManual(lista);
          this.dialog.closeAll()
        }
      })
    ).subscribe((asd) => console.log(sub.unsubscribe()))
  }

  editarRegistro(registro: Persona) {
    
  }
}
