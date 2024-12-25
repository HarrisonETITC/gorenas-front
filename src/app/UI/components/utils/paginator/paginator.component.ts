import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AppUtil } from '@utils/app.util';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-paginator',
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit, OnDestroy {
  @Input({ required: true }) registros: number = 25;
  @Input({ required: true }) data: Observable<Array<any>>;
  @Output() protected cambioPagina = new EventEmitter<Observable<Array<any>>>();

  private readonly dataHandler: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  protected itemsMostrados$: Observable<Array<any>>;
  protected items: Array<any>;
  protected paginaActual: number = 0;
  protected totalPaginas: number = 0;
  protected paginas: Array<number> = [];
  protected botonSiguiente: boolean = false;
  protected botonAnterior: boolean = false;
  protected maxPaginasVisible: number = 8;
  protected paginasVisibles: Array<number> = [];

  private dataSub: Subscription;

  ngOnInit(): void {
    this.dataSub = this.data?.pipe(
      tap((valores) => {
        if (!AppUtil.verificarVacio(valores)) {
          this.paginaActual = 1;
          this.totalPaginas = Math.ceil(valores.length / this.registros);
          for (let i = 1; i <= this.totalPaginas; i++) {
            this.paginas.push(i);
          }
          this.items = valores;
          this.refrescarInformacion();
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }

  protected irPagina(pagina: number) {
    this.paginaActual = pagina;
    this.refrescarInformacion();
  }

  protected paginaSiguiente() {
    this.paginaActual++;
    this.refrescarInformacion();
  }

  protected paginaAnterior() {
    this.paginaActual--;
    this.refrescarInformacion();
  }

  protected refrescarInformacion() {
    this.botonAnterior = (this.paginaActual != 1);
    this.botonSiguiente = (this.paginaActual < this.totalPaginas);

    const indexInicio = (this.paginaActual - 1) * this.registros;
    const indexFin = indexInicio + this.registros;
    const paginatedItems = this.items.slice(indexInicio, indexFin);

    this.dataHandler.next(paginatedItems);
    this.itemsMostrados$ = this.dataHandler.asObservable();
    this.cambioPagina.emit(this.itemsMostrados$);

    this.actualizarPaginasVisibles();
  }

  refrescarManual(nuevosItems: Array<any>) {
    this.botonAnterior = (this.paginaActual != 1);
    this.botonSiguiente = (this.paginaActual < this.totalPaginas);

    const indexInicio = (this.paginaActual - 1) * this.registros;
    const indexFin = indexInicio + this.registros;
    const paginatedItems = nuevosItems.slice(indexInicio, indexFin);

    this.dataHandler.next(paginatedItems);
    this.itemsMostrados$ = this.dataHandler.asObservable();
    this.cambioPagina.emit(this.itemsMostrados$);

    this.actualizarPaginasVisibles();
  }

  protected actualizarPaginasVisibles() {
    const paginaInicial = Math.max(1, this.paginaActual - Math.floor(this.maxPaginasVisible / 2));
    const paginaFinal = Math.min(this.totalPaginas, paginaInicial + this.maxPaginasVisible - 1);

    this.paginasVisibles = [];
    for (let i = paginaInicial; i <= paginaFinal; i++) {
      this.paginasVisibles.push(i);
    }
  }
}
