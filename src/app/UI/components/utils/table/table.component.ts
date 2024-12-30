import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Usuario } from '@models/usuario.model';
import { AppUtil } from '@utils/app.util';
import { BehaviorSubject, catchError, distinctUntilChanged, filter, Observable } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { IIdValor } from '@models/base/id-valor.interface';
import { Router, RouterModule } from '@angular/router';
import { AuthUtils } from '@utils/auth.util';
import { PaginatorServiceAdapter } from '@Application/adapters/services/utils/paginator-adapter.service';

@Component({
  selector: 'app-table',
  imports: [CommonModule, PaginatorComponent, RouterModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableComponent<T extends { id?: number }> implements OnInit, AfterViewInit {
  @Input({ required: true }) cabeceras$: Observable<Array<string>>;
  @Input({ required: true }) informacion$: Observable<Array<T>>;
  @Input({ required: true }) mapeos: Map<string, string>;
  @Input() mapeosValores: Map<string, Array<IIdValor>>;
  @ViewChild(PaginatorComponent) paginador: PaginatorComponent;
  private firstLoad = true;

  @Output() protected btnInactivar = new EventEmitter<T>();
  @Output() protected btnEditar = new EventEmitter<T>();
  private readonly filteredInfo = new BehaviorSubject<Array<T>>([]);
  private filteredDataNotifier: Observable<Array<T>>;

  mapaEstados = Usuario.MAPEOS_ESTADOS;
  headersDinero = ['ganancias', 'mes', 'total', 'totales', 'monto'];
  rutaActual: string = '';

  constructor(
    private readonly router: Router,
    private readonly pService: PaginatorServiceAdapter,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const url = this.router.routerState.snapshot.url;
    this.rutaActual = url.split('/').pop();
  }

  ngAfterViewInit(): void {
    this.pService.getData()
      .pipe(
        filter(data => !AppUtil.verifyEmpty(data)),
        distinctUntilChanged()
      )
      .subscribe((info) => {
        this.filteredInfo.next(info);
        if (this.firstLoad) {
          this.firstLoad = false;
          this.cdr.detectChanges();
        }
      });
  }

  obtenerLlaves(valor: T) {
    return Object.keys(valor);
  }

  transformarValor(valor: any, llave?: string) {
    const expFecha = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d+)?(Z|[+-][01]\d:[0-5]\d)?$/;

    if (expFecha.test(valor)) {
      const fecha = new Date(valor);
      return `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
    }

    if (!AppUtil.verificarVacio(valor['valor']))
      return valor.valor;

    if (!AppUtil.verificarVacio(llave) && this.headersDinero.includes(llave)) {
      return Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);
    }

    if (!AppUtil.verificarVacio(this.mapeosValores) && !AppUtil.verificarVacio(this.mapeosValores.get(llave))) {
      const obj = this.mapeosValores.get(llave).find((r) => r.id = valor);
      return obj.valor;
    }

    return valor;
  }

  protected refrescarInformacion(data: Observable<Array<T>>) {
    this.filteredDataNotifier = data;
  }

  get filtered$(): Observable<Array<T>> {
    return this.filteredInfo.asObservable();
  }

  refrescarManual(data: Array<T>) {
    this.paginador.refrescarManual(data);
  }

  protected botonInactivar(registro: T) {
    this.btnInactivar.emit(registro);
  }

  protected botonEditar(registro: T) {
    this.btnEditar.emit(registro);
  }

  puedeVer(btn: string) {
    return AuthUtils.verificarPuedeVer(`${this.rutaActual}-${btn}`)
  }
}
