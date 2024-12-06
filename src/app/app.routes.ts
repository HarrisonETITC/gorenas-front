import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { homeGuard } from './core/guards/home.guard';
import { appGuard } from './core/guards/app.guard';
import { AplicacionComponent } from '@components/aplicacion/aplicacion.component';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { SucursalesComponent } from '@components/sucursales/sucursales.component';
import { EmpleadosComponent } from '@components/empleados/empleados.component';
import { VentasComponent } from '@components/ventas/ventas.component';
import { UsuariosComponent } from '@components/usuarios/usuarios.component';
import { PersonasComponent } from '@components/personas/personas.component';
import { RolComponent } from '@components/rol/rol.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', redirectTo: 'home', pathMatch: 'full' },
    { path: 'register', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent, canActivate: [homeGuard] },
            { path: 'register', component: RegisterComponent, canActivate: [homeGuard] }
        ]
    },
    {
        path: 'app', component: AplicacionComponent, canActivate: [appGuard], children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent, canActivate: [appGuard] },
            { path: 'sucursales', component: SucursalesComponent, canActivate: [appGuard] },
            { path: 'empleados', component: EmpleadosComponent, canActivate: [appGuard] },
            { path: 'ventas', component: VentasComponent, canActivate: [appGuard] },
            { path: 'usuarios', component: UsuariosComponent, canActivate: [appGuard] },
            { path: 'personas', component: PersonasComponent, canActivate: [appGuard] },
            { path: 'roles', component: RolComponent, canActivate: [appGuard] },

        ]
    }
];
