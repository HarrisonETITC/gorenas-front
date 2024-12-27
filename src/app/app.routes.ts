import { Routes } from '@angular/router';
import { homeGuard } from './core/guards/home.guard';
import { appGuard } from './core/guards/app.guard';
import { ApplicationComponent } from '@components/app/application/application.component';
import { DashboardComponent } from '@components/app/dashboard/dashboard.component';
import { BranchesComponent } from '@components/app/branches/branches.component';
import { EmployeesComponent } from '@components/app/employees/employees.component';
import { SalesComponent } from '@components/app/sales/sales.component';
import { UsuariosComponent } from '@components/app/users/users.component';
import { PersonsComponent } from '@components/app/persons/persons.component';
import { RolesComponent } from '@components/app/roles/roles.component';
import { LoginComponent } from '@components/auth/login/login.component';
import { RoleModel } from '@Domain/models/base/role.model';
import { PermissionComponent } from '@components/app/permission/permission.component';
import { formDataGuard } from './core/guards/form-data.guard';
import { AppModel } from '@Domain/models/base/application.model';

const createUpdateRoutes: Routes = [
    {
        path: 'form',
        loadComponent: () => import('@UI/components/utils/forms/form-base-data/form-base-data.component').then(m => m.FormBaseDataComponent),
        canDeactivate: [formDataGuard]
    },
    {
        path: 'form/:id',
        loadComponent: () => import('@UI/components/utils/forms/form-base-data/form-base-data.component').then(m => m.FormBaseDataComponent),
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
                path: AppModel.MODULE_USERS, component: UsuariosComponent, canActivate: [appGuard], children: createUpdateRoutes,
                data: { acceptedRoles: [RoleModel.ROLE_ADMINISTRATOR, RoleModel.ROLE_PROPIETARY, RoleModel.ROLE_MANAGER] }
            },
            {
                path: AppModel.MODULE_PERSONS, component: PersonsComponent, canActivate: [appGuard], children: createUpdateRoutes
            },
            {
                path: AppModel.MODULE_ROLES, component: RolesComponent, canActivate: [appGuard], children: createUpdateRoutes,
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
