// import { CommonModule } from '@angular/common';
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import { GenericFormComponent } from '@gorenas/ui-forms';
// import { TableComponent } from '@gorenas/ui-commons';
// import { FormItemModel } from '@gorenas/shared-util-forms';
// import { RoleModel } from '@gorenas/domain';
// import { AppUtil } from '@gorenas/application-core';
// import { FormsUtil } from '@gorenas/shared-util-forms';
// import { concatMap, EMPTY, map, Observable, tap } from 'rxjs';

// @Component({
//   selector: 'app-employees',
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './employees.component.html',
//   styleUrl: './employees.component.css',
//   providers: []
// })
export class EmployeesComponent {
  // empleados$: Observable<Array<Empleado>>;
  // columnas$: Observable<Array<string>>;
  // mapeos = Empleado.mapeoCols;
  // @ViewChild(TableComponent) tabla: TableComponent<Empleado>;

  // formEmpleado = new FormGroup({
  //   salario: new FormControl<number>(NaN, [Validators.required]),
  //   sucursalId: new FormControl<string>('', [Validators.required]),
  //   personaId: new FormControl<string>('', [Validators.required])
  // })
  // formEmpleadoCampos: Array<FormItemModel>;
  // puedeAgregar = [RoleModel.ROL_ADMINISTRADOR, RoleModel.ROL_PROPIETARIO, RoleModel.ROL_GERENTE].includes(sessionStorage.getItem('rol'));

  // constructor(
  //   private readonly sucursalService: SucursalesService,
  //   private readonly personaService: PersonasService,
  //   private readonly empleadosService: EmpleadosService,
  //   private readonly dialog: MatDialog
  // ) { }

  // ngOnInit(): void {
  //   this.buscarSucursales();
  //   this.columnas$ = this.empleados$.pipe(
  //     map(suc => { return suc.length > 0 ? Object.keys(suc[0]) : [] })
  //   );
  //   this.iniciarCamposFormulario();
  // }

  // buscarSucursales() {
  //   this.empleados$ = this.empleadosService.getEmpleados();
  // }

  // iniciarCamposFormulario() {
  //   const campoPersona = this.personaService.generarAutoComplete('personaId', 'Persona', 'accessibility-outline');
  //   const campoSucursal = this.sucursalService.generarAutoComplete('sucursalId', 'Sucursal asociada', 'home-outline');
  //   this.formEmpleadoCampos = [
  //     new FormItemModel('salario', FormItemModel.TIPO_NUMBER, 'Salario mensual', 'wallet-outline'),
  //     campoPersona.item,
  //     campoSucursal.item
  //   ]
  // }

  // abrirFormulario(data?: Empleado) {
  //   const titulo = !AppUtil.verificarVacio(data) ? 'Editar' : 'Registrar';
  //   this.dialog.open(GenericFormComponent, {
  //     data: { form: this.formEmpleado, campos: this.formEmpleadoCampos, config: new FormConfig(`${titulo} Empleado`, titulo), servicio: this.personaService, editar: !AppUtil.verificarVacio(data) }
  //   });

  //   const sub = this.personaService.getNotificador().pipe(
  //     concatMap((val) => {
  //       if (val == 'Guardar') {
  //         const nuevoEmpleado: createEmpleadoData = FormsUtil.convertirFormObjeto(this.formEmpleado, this.formEmpleadoCampos);
  //         return this.empleadosService.crearEmpleado(nuevoEmpleado);
  //       }

  //       if (val == 'Editar') {
  //         const editar: createEmpleadoData = FormsUtil.convertirFormObjeto(this.formEmpleado, this.formEmpleadoCampos, data.id);
  //         return this.empleadosService.editarEmpleado(editar);
  //       }

  //       return EMPTY
  //     }),
  //     concatMap((valor) => {
  //       if (!AppUtil.verificarVacio(valor))
  //         return this.empleadosService.getEmpleados()

  //       return EMPTY
  //     }),
  //     tap((lista) => {
  //       if (!AppUtil.verificarVacio(lista)) {
  //         this.dialog.closeAll()
  //         this.personaService.notificarTerminado();
  //       }
  //     })
  //   ).subscribe(() => sub.unsubscribe())
  // }

  // editarRegistro(registro: Empleado) {
  //   this.empleadosService.buscarPorId(registro.id).pipe(
  //     concatMap((suc) => {
  //       FormsUtil.llenarFormConCampos(this.formEmpleado, this.formEmpleadoCampos, suc);
  //       return this.personaService.getByEmpleadoId(registro.id);
  //     }),
  //     concatMap((persona) => {
  //       FormsUtil.setValorAutoComplete(this.formEmpleado, this.formEmpleadoCampos, 'personaId', { id: persona.id, valor: `${persona.nombres} ${persona.apellidos}` })
  //       return this.sucursalService.getSucursalByEmpleadoId(registro.id);
  //     }),
  //     tap((sucursal) => {
  //       FormsUtil.setValorAutoComplete(this.formEmpleado, this.formEmpleadoCampos, 'sucursalId', { id: sucursal, valor: sucursal.direccion })
  //       this.abrirFormulario(registro)
  //     })
  //   ).subscribe()
  // }
}
