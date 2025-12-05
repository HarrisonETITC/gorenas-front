import { Routes } from '@angular/router';
import { homeGuard } from '@gorenas/shared-angular';
import { appGuard } from '@gorenas/shared-angular';
import { ApplicationComponent } from '@gorenas/ui-features';
import { DashboardComponent } from '@gorenas/ui-features';
import { BranchesComponent } from '@gorenas/ui-features';
import { EmployeesComponent } from '@gorenas/ui-features';
// import { SalesComponent } from '@gorenas/ui-features';
// import { UsuariosComponent } from '@gorenas/ui-features';
//import { PersonsComponent } from '@gorenas/ui-features';
// import { RolesComponent } from '@gorenas/ui-features';
import { LoginComponent } from '@gorenas/ui-commons';
import { RoleModel } from '@gorenas/domain';
import { PermissionComponent } from '@gorenas/ui-features';
import { formDataGuard } from '@gorenas/shared-angular';
import { AppModel } from '@gorenas/domain';
import { SalesComponent } from 'libs/ui/features/src/lib/sales/sales.component';

const createUpdateRoutes: Routes = [
    {
        path: 'form',
        loadComponent: () =>
            import('@gorenas/ui-controls').then(m => m.FormBaseDataComponent),
        canDeactivate: [formDataGuard]
    },
    {
        path: 'form/:id',
        loadComponent: () =>
            import('@gorenas/ui-controls').then(m => m.FormBaseDataComponent),
        canDeactivate: [formDataGuard]
    }
]

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', redirectTo: 'home', pathMatch: 'full' },
    { path: 'register', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent, canActivate: [homeGuard] }
        ]
    },
    {
        path: 'app', component: ApplicationComponent, canActivate: [appGuard], children: [
            { path: '', redirectTo: AppModel.MODULE_DASHBOARD, pathMatch: 'full' },
            {
                path: AppModel.MODULE_DASHBOARD, component: DashboardComponent, canActivate: [appGuard]
            },
            {
                path: AppModel.MODULE_BRANCHES, component: BranchesComponent, canActivate: [appGuard], children: createUpdateRoutes
            },
            {
                path: AppModel.MODULE_EMPLOYEES, component: EmployeesComponent, canActivate: [appGuard], children: createUpdateRoutes
            },
            {
                path: AppModel.MODULE_SALES, component: SalesComponent, canActivate: [appGuard], children: createUpdateRoutes
            },
            {
                path: AppModel.MODULE_USERS, component: ApplicationComponent, canActivate: [appGuard], children: createUpdateRoutes,
                data: { acceptedRoles: [RoleModel.ROLE_ADMINISTRATOR, RoleModel.ROLE_PROPIETARY, RoleModel.ROLE_MANAGER] }
            },
            {
                path: AppModel.MODULE_PERSONS, component: ApplicationComponent, canActivate: [appGuard], children: createUpdateRoutes
            },
            {
                path: AppModel.MODULE_ROLES, component: ApplicationComponent, canActivate: [appGuard], children: createUpdateRoutes,
                data: { acceptedRoles: [RoleModel.ROLE_ADMINISTRATOR] }
            },
            {
                path: AppModel.MODULE_PERMISSIONS, component: PermissionComponent, canActivate: [appGuard], children: createUpdateRoutes,
                data: { acceptedRoles: [RoleModel.ROLE_ADMINISTRATOR] }
            },
            { path: '**', redirectTo: AppModel.MODULE_DASHBOARD, pathMatch: 'full' }
        ]
    }
];
