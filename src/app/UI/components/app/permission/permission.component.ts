import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { PERMISSION_SERVICE } from '@Application/config/providers/permission.providers';
import { PERSON_SERVICE } from '@Application/config/providers/person.providers';
import { ApiServicePort } from '@Application/ports/api-service.port';
import { AuthServicePort } from '@Application/ports/auth-service.port';
import { FiltersCompactComponent } from '@components/utils/filters/filters-compact/filters-compact.component';
import { FiltersExtendedComponent } from '@components/utils/filters/filters-extended/filters-extended.component';
import { TableComponent } from '@components/utils/table/table.component';
import { PermissionModel } from '@Domain/models/base/permission.model';
import { PersonModel } from '@Domain/models/base/person.model';
import { RoleModel } from '@Domain/models/base/role.model';
import { FormItemModel } from '@Domain/models/form-item.model';
import { PermissionModelView } from '@Domain/models/model-view/permission.mv';
import { PersonModelView } from '@Domain/models/model-view/person.mv';
import { PermissionFilter } from '@models/filter/permission.filter';
import { AppUtil } from '@utils/app.util';
import { distinctUntilChanged, filter, map, Observable, Subscription, take, tap, throttleTime } from 'rxjs';
import { UseTable } from 'src/app/core/interfaces/use-table.interface';
import { MatMenuModule } from '@angular/material/menu';
import { FIELDS_SERVICE } from '@Application/config/providers/form.providers';
import { FieldsServicePort } from '@Application/ports/forms/fields-service.port';

@Component({
  selector: 'app-permission',
  imports: [CommonModule, TableComponent, FiltersExtendedComponent, MatIconModule, FiltersCompactComponent, MatSlideToggleModule, MatButtonModule, MatMenuModule],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent implements OnInit, OnDestroy, UseTable<PermissionModelView> {
  data$: Observable<Array<PermissionModelView>>;
  cols$: Observable<string[]>;
  headers: Map<string, string>;
  subs: Array<Subscription> = [];
  filtersSub: Subscription;
  filterFields: Array<FormItemModel>;
  protected filterType: boolean = false;
  persons$;

  constructor(
    @Inject(PERMISSION_SERVICE)
    private readonly service: ApiServicePort<PermissionModel, PermissionModelView>,
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    @Inject(PERSON_SERVICE)
    private readonly personService: ApiServicePort<PersonModel, PersonModelView>,
    @Inject(FIELDS_SERVICE)
    private readonly fieldsService: FieldsServicePort
  ) { }

  ngOnInit(): void {
    const dataSub = this.authService.getUser()
      .pipe(
        filter(user => !AppUtil.verifyEmpty(user) && !AppUtil.verifyEmpty(user.role)),
        take(1),
        tap(user => {
          this.initData({ roleName: user.role, module: null, permission: null })
          this.initFilters(user.role);
        })
      )
      .subscribe();
    this.subs.push(dataSub);
    this.headers = PermissionModelView.headers;
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => {
      if (!s.closed)
        s.unsubscribe();
    });
    this.filtersSub?.unsubscribe();
    this.fieldsService.resetControls();
  }

  initData(filter?: PermissionFilter): void {
    this.search(filter);
    this.cols$ = this.data$.pipe(
      map(perm => { return perm.length > 0 ? Object.keys(perm[0]) : [] })
    );
  }

  search(filterP?: PermissionFilter): void {
    this.data$ = this.service.getCanSee(filterP).pipe(
      filter(f => !AppUtil.verifyEmpty(f)),
      distinctUntilChanged()
    );
  }

  initFilters(roleName: string): void {
    this.filterFields = PermissionFilter.FIELDS;
    PermissionFilter.FIELDS.find(f => f.name === 'roleName').defaultValue = roleName
  }

  handleSearch(event: Observable<PermissionFilter>) {
    this.filtersSub = event.pipe(
      filter(f => !AppUtil.verifyEmpty(f)),
      distinctUntilChanged(),
      throttleTime(500, undefined, { leading: true, trailing: true }),
    ).subscribe(filter => this.search(filter));
  }
}
