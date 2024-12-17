import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormgenericoComponent } from '@components/utils/formgenerico/formgenerico.component';
import { TableComponent } from '@components/utils/table/table.component';
import { FormConfig } from '@models/formulario/form-config.model';
import { FormItem } from '@models/formulario/form-item.model';
import { RolModel } from '@models/rol.model';
import { Sucursal } from '@models/sucursal.model';
import { RestauranteService } from '@services/restaurante.service';
import { createSucursalData, SucursalesService } from '@services/sucursales.service';
import { AppUtil } from '@utils/app.util';
import { FormsUtil } from '@utils/forms.util';
import { concatMap, EMPTY, map, Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-sucursales',
  imports: [TableComponent, ReactiveFormsModule, MatDialogModule],
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.css',
  providers: [SucursalesService, RestauranteService]
})
export class SucursalesComponent implements OnInit {
  sucursales$: Observable<Array<Sucursal>>;
  columnas$: Observable<Array<string>>;
  mapeos = Sucursal.mapeoCols;
  @ViewChild(TableComponent) tabla: TableComponent<Sucursal>;
  puedeAgregar = [RolModel.ROL_ADMINISTRADOR, RolModel.ROL_PROPIETARIO].includes(sessionStorage.getItem('rol'));

  formSucursal = new FormGroup({
    direccion: new FormControl<string>('', [Validators.required]),
    mes: new FormControl<number>(0, [Validators.required]),
    restauranteId: new FormControl<string>('', [Validators.required])
  })
  formSucursalCampos: Array<FormItem>;
  subs: Array<Subscription> = [];

  constructor(
    private readonly sucursalService: SucursalesService,
    private readonly restauranteService: RestauranteService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscarSucursales();
    this.columnas$ = this.sucursales$.pipe(
      map(suc => { return suc.length > 0 ? Object.keys(suc[0]) : [] })
    );
    this.iniciarCamposFormulario();
  }

  buscarSucursales() {
    this.sucursales$ = this.sucursalService.getSucursales();
  }

  iniciarCamposFormulario() {
    const autocompleteRestaurante = this.restauranteService.generarAutoComplete('restauranteId', 'Restaurante asociado', 'business-outline');
    this.subs.push(autocompleteRestaurante.sub);
    this.formSucursalCampos = [
      new FormItem('direccion', FormItem.TIPO_TEXT, 'Dirección de la sucursal', 'analytics-outline'),
      new FormItem('mes', FormItem.TIPO_NUMBER, 'Ganancias iniciales', 'cash-outline'),
      autocompleteRestaurante.item
    ]
  }

  abrirFormulario(data?: Sucursal) {
    const titulo = !AppUtil.verificarVacio(data) ? 'Editar' : 'Registrar';
    this.dialog.open(FormgenericoComponent, {
      data: { form: this.formSucursal, campos: this.formSucursalCampos, config: new FormConfig(`${titulo} Sucursal`, titulo), servicio: this.restauranteService, editar: !AppUtil.verificarVacio(data) }
    });

    const sub = this.restauranteService.getNotificador().pipe(
      concatMap((val) => {
        if (val == 'Guardar') {
          const nuevaSucursal: createSucursalData = FormsUtil.convertirFormObjeto(this.formSucursal, this.formSucursalCampos);
          return this.sucursalService.crearSucursal(nuevaSucursal);
        }

        if (val == 'Editar') {
          const editar: createSucursalData = FormsUtil.convertirFormObjeto(this.formSucursal, this.formSucursalCampos, data.id);
          return this.sucursalService.editarSucursal(editar);
        }

        return EMPTY
      }),
      concatMap((valor) => {
        if (!AppUtil.verificarVacio(valor))
          return this.sucursalService.getSucursales()

        return EMPTY
      }),
      tap((lista) => {
        if (!AppUtil.verificarVacio(lista)) {
          this.tabla.refrescarManual(lista);
          this.dialog.closeAll()
          this.restauranteService.notificarTerminado();
        }
      })
    ).subscribe(() => sub.unsubscribe())
  }

  editarRegistro(registro: Sucursal) {
    const sub = this.sucursalService.getSucursalById(registro.id).pipe(
      concatMap((suc) => {
        FormsUtil.llenarFormConCampos(this.formSucursal, this.formSucursalCampos, suc);
        return this.sucursalService.getRestauranteBySucursalId(registro.id);
      }),
      tap((restaurante) => {
        FormsUtil.setValorAutoComplete(this.formSucursal, this.formSucursalCampos, 'restauranteId', { id: restaurante.id, valor: restaurante.nombre })
        this.abrirFormulario(registro)
      })
    )

      .subscribe((data) => sub.unsubscribe())
  }
}
