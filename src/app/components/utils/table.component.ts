import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Usuario } from '@models/usuario.model';
import { AppUtil } from '@utils/app.util';
import { Observable } from 'rxjs';
import { PaginadorComponent } from './paginador.component';

@Component({
  selector: 'app-table',
  imports: [CommonModule, PaginadorComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent<T extends { id: number }> {
  @Input({ required: true }) cabeceras$: Observable<Array<string>>;
  @Input({ required: true }) informacion$: Observable<Array<T>>;
  @Input({ required: true }) mapeos: Map<string, string>;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  @Output() protected btnInactivar = new EventEmitter<T>();
  @Output() protected btnEditar = new EventEmitter<T>();

  mapaEstados = Usuario.MAPEOS_ESTADOS;
  headersDinero = ['ganancias', 'mes', 'total', 'totales'];

  obtenerLlaves(valor: T) {
    return Object.keys(valor);
  }

  transformarValor(valor: any, llave?: string) {
    const expFecha = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d+)?(Z|[+-][01]\d:[0-5]\d)?$/;

    if (expFecha.test(valor)) {
      const fecha = new Date(valor);
      return `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
    }

    if (!AppUtil.verificarVacio(llave) && this.headersDinero.includes(llave)) {
      return Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);
    }
    return valor;
  }

  protected refrescarInformacion(data: Observable<Array<T>>) {
    this.informacion$ = data;
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
}
