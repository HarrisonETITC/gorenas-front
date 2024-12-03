import { Component, OnInit } from '@angular/core';
import { TableComponent } from '@components/utils/table.component';
import { Sucursal } from '@models/sucursal.model';
import { SucursalesService } from '@services/sucursales.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-sucursales',
  imports: [TableComponent],
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.css',
  providers: [SucursalesService]
})
export class SucursalesComponent implements OnInit {
  sucursales$: Observable<Array<Sucursal>>;
  columnas$: Observable<Array<string>>;
  mapeos = Sucursal.mapeoCols;

  constructor(
    private readonly sucursalService: SucursalesService
  ) { }

  ngOnInit(): void {
    this.sucursales$ = this.sucursalService.getSucursales();
    this.columnas$ = this.sucursales$.pipe(
      map(suc => { return suc.length > 0 ? Object.keys(suc[0]) : [] })
    );
  }

}
