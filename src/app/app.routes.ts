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
import { RegisterComponent } from '@components/auth/register/register.component';
import { RoleModel } from '@Domain/models/base/role.model';
import { PermissionComponent } from '@components/app/permission/permission.component';

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
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard', component: DashboardComponent, canActivate: [appGuard]
            },
            {
                path: 'branches', component: BranchesComponent, canActivate: [appGuard]
            },
            {
                path: 'employees', component: EmployeesComponent, canActivate: [appGuard]
            },
            {
                path: 'sales', component: SalesComponent, canActivate: [appGuard]
            },
            {
                path: 'users', component: UsuariosComponent, canActivate: [appGuard],
                data: { acceptedRoles: [RoleModel.ROLE_ADMINISTRATOR, RoleModel.ROLE_PROPIETARY, RoleModel.ROLE_MANAGER] }
            },
            {
                path: 'persons', component: PersonsComponent, canActivate: [appGuard]
            },
            {
                path: 'roles', component: RolesComponent, canActivate: [appGuard],
                data: { acceptedRoles: [RoleModel.ROLE_ADMINISTRATOR] }
            },
            {
                path: 'permissions', component: PermissionComponent, canActivate: [appGuard],
                data: { acceptedRoles: [RoleModel.ROLE_ADMINISTRATOR] }
            },
            { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
