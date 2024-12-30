import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PaginatorServiceAdapter } from '@Application/adapters/services/utils/paginator-adapter.service';
import { PAGINATOR_SERVICE } from '@Application/config/providers/utils/utils.providers';
import { PaginatorServicePort } from '@Application/ports/forms/paginator-service.port';
import { AppUtil } from '@utils/app.util';
import { BehaviorSubject, distinctUntilChanged, filter, Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-paginator',
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent<T = any> implements OnInit, OnDestroy {
  @Input({ required: true }) registros: number = 25;
  @Input({ required: true }) data: Observable<Array<any>>;
  @Output() protected cambioPagina = new EventEmitter<Observable<Array<any>>>();

  private readonly dataHandler: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  protected items: Array<any>;
  protected actualPage: number = 0;
  protected totalPages: number = 0;
  protected pages: Array<number> = [];
  protected buttonNext: boolean = false;
  protected buttonPrevious: boolean = false;
  protected maxVisiblePages: number = 8;
  protected visiblePages: Array<number> = [];

  private dataSub: Subscription;

  constructor(
    @Inject(PAGINATOR_SERVICE)
    private readonly paginatorService: PaginatorServicePort<T>,
  ) { }

  ngOnInit(): void {
    this.paginatorService.originalData$.pipe(
      filter(values => !AppUtil.verifyEmpty(values)),
      distinctUntilChanged(),
      tap((values) => {
        this.actualPage = 1;
        this.totalPages = Math.ceil(values.length / this.registros);
        for (let i = 1; i <= this.totalPages; i++) {
          this.pages.push(i);
        }
        this.items = values;
        this.refreshInfo();
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }

  protected goPage(page: number) {
    this.actualPage = page;
    this.refreshInfo();
  }

  protected goNextPage() {
    this.actualPage++;
    this.refreshInfo();
  }

  protected goPreviousPage() {
    this.actualPage--;
    this.refreshInfo();
  }

  protected refreshInfo() {
    this.buttonPrevious = (this.actualPage != 1);
    this.buttonNext = (this.actualPage < this.totalPages);

    const initIndex = (this.actualPage - 1) * this.registros;
    const endIndex = initIndex + this.registros;
    const paginatedItems = this.items.slice(initIndex, endIndex);

    this.paginatorService.filteredData = paginatedItems;

    this.updateVisiblePages();
  }

  refrescarManual(nuevosItems: Array<any>) {
    this.buttonPrevious = (this.actualPage != 1);
    this.buttonNext = (this.actualPage < this.totalPages);

    const indexInicio = (this.actualPage - 1) * this.registros;
    const indexFin = indexInicio + this.registros;
    const paginatedItems = nuevosItems.slice(indexInicio, indexFin);

    this.updateVisiblePages();
  }

  protected updateVisiblePages() {
    const initPage = Math.max(1, this.actualPage - Math.floor(this.maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, initPage + this.maxVisiblePages - 1);

    this.visiblePages = [];
    for (let i = initPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }
}
