import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormgenericoComponent } from '@components/utils/formgenerico.component';
import { TableComponent } from '@components/utils/table.component';
import { FormConfig } from '@models/formulario/form-config.model';
import { FormItem } from '@models/formulario/form-item.model';
import { Restaurante } from '@models/restaurante.model';
import { Sucursal } from '@models/sucursal.model';
import { RestauranteService } from '@services/restaurante.service';
import { createSucursalData, SucursalesService } from '@services/sucursales.service';
import { AppUtil } from '@utils/app.util';
import { concat, concatMap, EMPTY, map, Observable, Subscription, tap } from 'rxjs';

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

  formSucursal = new FormGroup({
    direccion: new FormControl<string>('', [Validators.required]),
    ganancias: new FormControl<number>(0, [Validators.required]),
    restaurante: new FormControl<string>('', [Validators.required])
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
    const autocompleteRestaurante = this.restauranteService.generarAutoComplete('restaurante', 'Restaurante asociado', 'business-outline');
    this.subs.push(autocompleteRestaurante.sub);
    this.formSucursalCampos = [
      new FormItem('direccion', FormItem.TIPO_TEXT, 'Dirección de la sucursal', 'analytics-outline'),
      new FormItem('ganancias', FormItem.TIPO_NUMBER, 'Ganancias iniciales', 'cash-outline'),
      autocompleteRestaurante.item
    ]
  }

  abrirFormulario(data?: Restaurante) {
    const titulo = !AppUtil.verificarVacio(data) ? 'Editar' : 'Registrar';
    this.dialog.open(FormgenericoComponent, {
      data: { form: this.formSucursal, campos: this.formSucursalCampos, config: new FormConfig(`${titulo} Sucursal`, titulo), servicio: this.restauranteService }
    });

    const sub = this.restauranteService.getNotificador().pipe(
      concatMap((val) => {
        if (val == 'Guardar') {
          const nuevaSucursal: createSucursalData = {
            direccion: this.formSucursal.controls.direccion.value,
            mes: this.formSucursal.controls.ganancias.value,
            restauranteId: this.formSucursalCampos.at(2).valorAutoComplete.id
          };
          return this.sucursalService.crearSucursal(nuevaSucursal);
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
        }
      })
    ).subscribe(() => sub.unsubscribe())
  }

  editarRegistro(registro: Sucursal) {
    this.sucursalService.getRestauranteBySucursalId(registro.id).subscribe((data) => {
      this.formSucursal.controls.direccion.setValue(registro.direccion);
      this.formSucursal.controls.ganancias.setValue(registro.ganancias);
      this.formSucursal.controls.restaurante.setValue(data.nombre);

      this.formSucursalCampos.at(2).valorAutoComplete = { id: data.id, valor: data.nombre };

      this.dialog.open(FormgenericoComponent, {
        data: { form: this.formSucursal, campos: this.formSucursalCampos, config: new FormConfig(`Editar Sucursal`, 'Editar'), servicio: this.restauranteService }
      });
    })
  }

}
