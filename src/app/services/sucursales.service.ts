import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Sucursal } from '@models/sucursal.model';
import { apiUrl, basicHeaders } from '../environment';
import { AppUtil } from '@utils/app.util';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {
  private http: HttpClient = inject(HttpClient);
  constructor() { }

  getSucursales(): Observable<Array<Sucursal>> {
    return this.http.get<Array<Sucursal>>(
      `${apiUrl}/sucursal/todos?userId=${AppUtil.getUserId()}&rol=${AppUtil.getRol()}`,
      {
        headers: basicHeaders
      }
    );
  }

}
