import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { AUTH_SERVICE } from '@Application/config/providers/auth.providers';
import { PERMISSION_SERVICE } from '@Application/config/providers/permission.providers';
import { ApiServicePort } from '@Application/ports/api-service.port';
import { AuthServicePort } from '@Application/ports/auth-service.port';
import { FiltersCompactComponent } from '@components/utils/filters/filters-compact/filters-compact.component';
import { FiltersExtendedComponent } from '@components/utils/filters/filters-extended/filters-extended.component';
import { TableComponent } from '@components/utils/table/table.component';
import { PermissionModel } from '@Domain/models/base/permission.model';
import { FormItemModel } from '@Domain/models/form-item.model';
import { PermissionModelView } from '@Domain/models/model-view/permission.mv';
import { PermissionFilter } from '@models/filter/permission.filter';
import { AppUtil } from '@utils/app.util';
import { distinctUntilChanged, filter, map, Observable, Subscription, take, tap, throttleTime } from 'rxjs';
import { UseTable } from 'src/app/core/interfaces/use-table.interface';
import { MatMenuModule } from '@angular/material/menu';
import { FIELDS_SERVICE, FORM_DATA_SERVICE } from '@Application/config/providers/form.providers';
import { FieldsServicePort } from '@Application/ports/forms/fields-service.port';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormDataServicePort } from '@Application/ports/forms/form-data-service.port';

@Component({
  selector: 'app-permission',
  imports: [CommonModule, TableComponent, FiltersExtendedComponent, MatIconModule, FiltersCompactComponent, MatSlideToggleModule, MatButtonModule, MatMenuModule, RouterOutlet, AsyncPipe],
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
  protected isFormView$: Observable<boolean>;

  constructor(
    @Inject(PERMISSION_SERVICE)
    private readonly service: ApiServicePort<PermissionModel, PermissionModelView>,
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
    @Inject(FIELDS_SERVICE)
    private readonly fieldsService: FieldsServicePort,
    @Inject(FORM_DATA_SERVICE)
    private readonly formDataService: FormDataServicePort,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isFormView$ = this.formDataService.isFormActive();
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

  goCreate(): void {
    this.formDataService.updateState(true);
    this.router.navigate(['create'], { relativeTo: this.route });
  }
}
