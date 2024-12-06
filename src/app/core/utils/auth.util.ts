import { RolModel } from "@models/rol.model";

export class AuthUtils {
    static verificarPuedeVer(id: string): boolean {
        const rol = sessionStorage.getItem('rol');
        if (id == 'dashboard')
            return true;
        if (id == 'sucursales')
            return ROLES_SUCURSALES.includes(rol);
        if (id == 'empleados')
            return ROLES_EMPLEADOS.includes(rol);
        if (id == 'ventas')
            return ROLES_VENTAS.includes(rol);
        if (id == 'usuarios')
            return ROLES_USUARIOS.includes(rol);
        if (id == 'personas')
            return ROLES_PERSONAS.includes(rol);
        if (id == 'roles')
            return ROLES_ROLES.includes(rol);
        if (id == 'sucursales-editar' || id == 'empleados-editar' || id == 'ventas-editar' || id == 'personas-editar' || id == 'usuarios-editar')
            return ROLES_ADMIN_PROP_GERENTE.includes(rol);
        if (id == 'sucursales-inactivar' || id == 'empleados-inactivar' || id == 'ventas-inactivar' || id == 'personas-inactivar' || id == 'usuarios-inactivar')
            return ROLES_ADMIN_PROP_GERENTE.includes(rol);

        return false;
    }
}

export const ROLES_SUCURSALES = [RolModel.ROL_PROPIETARIO, RolModel.ROL_ADMINISTRADOR, RolModel.ROL_GERENTE];
export const ROLES_EMPLEADOS = [RolModel.ROL_PROPIETARIO, RolModel.ROL_ADMINISTRADOR, RolModel.ROL_GERENTE];
export const ROLES_VENTAS = [RolModel.ROL_PROPIETARIO, RolModel.ROL_ADMINISTRADOR, RolModel.ROL_GERENTE, RolModel.ROL_CAJERO];
export const ROLES_USUARIOS = [RolModel.ROL_PROPIETARIO, RolModel.ROL_ADMINISTRADOR, RolModel.ROL_GERENTE, RolModel.ROL_CAJERO];
export const ROLES_PERSONAS = [RolModel.ROL_PROPIETARIO, RolModel.ROL_ADMINISTRADOR, RolModel.ROL_GERENTE, RolModel.ROL_CAJERO];
export const ROLES_ROLES = [RolModel.ROL_ADMINISTRADOR];

export const ROLES_ADMIN_PROP = [RolModel.ROL_PROPIETARIO, RolModel.ROL_ADMINISTRADOR];
export const ROLES_ADMIN_PROP_GERENTE = ROLES_SUCURSALES;
export const TODOS = ROLES_PERSONAS





