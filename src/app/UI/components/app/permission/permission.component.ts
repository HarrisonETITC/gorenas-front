import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { PERMISSION_SERVICE } from '@Application/config/providers/permission.providers';
import { ApiServicePort } from '@Application/ports/api-service.port';
import { AuthServicePort } from '@Application/ports/auth-service.port';
import { TableComponent } from '@components/utils/table/table.component';
import { PermissionModel } from '@Domain/models/base/permission.model';
import { PermissionModelView } from '@Domain/models/model-view/permission.mv';
import { PermissionFilter } from '@models/filter/permission.filter';
import { AppUtil } from '@utils/app.util';
import { filter, map, Observable, Subscription } from 'rxjs';
import { UseTable } from 'src/app/core/interfaces/use-table.interface';

@Component({
  selector: 'app-permission',
  imports: [CommonModule, TableComponent],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent implements OnInit, OnDestroy, UseTable<PermissionModelView> {
  data$: Observable<Array<PermissionModelView>>;
  cols$: Observable<string[]>;
  headers: Map<string, string>;
  subs: Array<Subscription> = [];

  constructor(
    @Inject(PERMISSION_SERVICE)
    private readonly service: ApiServicePort<PermissionModel, PermissionModelView>,
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort
  ) { }

  ngOnInit(): void {
    const dataSub = this.authService.getUser()
      .pipe(
        filter(user => !AppUtil.verifyEmpty(user) && !AppUtil.verifyEmpty(user.role))
      )
      .subscribe(user => {
        this.initData({ roleName: user.role, query: 'k' })
        dataSub.unsubscribe();
      });
    this.subs.push(dataSub);
    this.headers = PermissionModelView.headers;
  }

  ngOnDestroy(): void {
      this.subs.forEach(s => {
        if (!s.closed)
          s.unsubscribe();
      })
  }

  initData(filter?: PermissionFilter): void {
    this.data$ = this.service.getCanSee(filter);
    this.cols$ = this.data$.pipe(
      map(perm => { return perm.length > 0 ? Object.keys(perm[0]) : [] })
    );
  }
}
