import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormgenericoComponent } from '@components/utils/formgenerico/formgenerico.component';
import { TableComponent } from '@components/utils/table/table.component';
import { IIdValor } from '@models/base/id-valor.interface';
import { FormConfig } from '@models/formulario/form-config.model';
import { FormItem } from '@models/formulario/form-item.model';
import { Venta } from '@models/venta.model';
import { EmpleadosService } from '@services/empleados.service';
import { createVentaData, VentasService } from '@services/ventas.service';
import { AppUtil } from '@utils/app.util';
import { FormsUtil } from '@utils/forms.util';
import { concatMap, EMPTY, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-ventas',
  imports: [TableComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css',
  providers: [EmpleadosService, VentasService]
})
export class VentasComponent {
  ventas$: Observable<Array<Venta>>;
  columnas$: Observable<Array<string>>;
  mapeos = Venta.mapeoCols;
  valores = new Map<string, Array<IIdValor>>();
  @ViewChild(TableComponent) tabla: TableComponent<Venta>;

  formSucursal = new FormGroup({
    monto: new FormControl<number>(NaN, [Validators.required]),
    metodoPago: new FormControl<number>(0, [Validators.required]),
    empleadoId: new FormControl<string>('', [Validators.required])
  })
  formSucursalCampos: Array<FormItem>;

  constructor(
    private readonly empleadosService: EmpleadosService,
    private readonly ventasService: VentasService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscarSucursales();
    this.columnas$ = this.ventas$.pipe(
      map(suc => { return suc.length > 0 ? Object.keys(suc[0]) : [] })
    );
    this.valores.set('metodo', Venta.METODOS_PAGO);
    this.iniciarCamposFormulario();
  }

  buscarSucursales() {
    this.ventas$ = this.ventasService.getMostrar();
  }

  iniciarCamposFormulario() {
    const completeEmpleados = this.empleadosService.generarAutoComplete('empleadoId', 'Realizada por', 'person-outline')
    this.formSucursalCampos = [
      new FormItem('monto', FormItem.TIPO_NUMBER, 'Valor de la venta', 'cash-outline'),
      new FormItem('metodoPago', FormItem.TIPO_SELECT, 'Método de pago', 'card-outline', Venta.METODOS_PAGO),
      completeEmpleados.item
    ]
  }

  abrirFormulario(data?: Venta) {
    const titulo = !AppUtil.verificarVacio(data) ? 'Editar' : 'Registrar';
    this.dialog.open(FormgenericoComponent, {
      data: { form: this.formSucursal, campos: this.formSucursalCampos, config: new FormConfig(`${titulo} Venta`, titulo), servicio: this.ventasService, editar: !AppUtil.verificarVacio(data) }
    });

    const sub = this.ventasService.getNotificador().pipe(
      concatMap((val) => {
        if (val == 'Guardar') {
          const nuevaSucursal: createVentaData = FormsUtil.convertirFormObjeto(this.formSucursal, this.formSucursalCampos);
          return this.ventasService.crearVenta(nuevaSucursal);
        }

        if (val == 'Editar') {
          const editar: createVentaData = FormsUtil.convertirFormObjeto(this.formSucursal, this.formSucursalCampos, data.id);
          return this.ventasService.editarVenta(editar);
        }

        return EMPTY
      }),
      concatMap((valor) => {
        if (!AppUtil.verificarVacio(valor))
          return this.ventasService.getMostrar()

        return EMPTY
      }),
      tap((lista) => {
        if (!AppUtil.verificarVacio(lista)) {
          this.tabla.refrescarManual(lista);
          this.dialog.closeAll()
          this.ventasService.notificarTerminado();
        }
      })
    ).subscribe(() => sub.unsubscribe())
  }

  editarRegistro(registro: Venta) {
    this.ventasService.getVentaById(registro.id).pipe(
      concatMap((v) => {
        FormsUtil.llenarFormConCampos(this.formSucursal, this.formSucursalCampos, v);
        return this.empleadosService.getEmpleadoByVentaId(registro.id);
      }),
      tap((emp) => {
        FormsUtil.setValorAutoComplete(this.formSucursal, this.formSucursalCampos, 'empleadoId', { id: emp.id, valor: emp.nombre })
        this.abrirFormulario(registro)
      })
    ).subscribe()
  }

}
