import { GeneralFilter } from "@models/base/general.filter";

export class AppUtil {
    public static verificarVacio(valor: any): boolean {
        const basic: boolean = (valor === undefined || valor === null);
        const objetoVacio = {};
        if (typeof valor === 'string') {
            return basic || valor === '' || valor === "" || valor === ``;
        } else if (typeof valor === 'number') {
            return basic || isNaN(valor);
        } else if (valor instanceof Array) {
            return basic || valor.length <= 0;
        } else if (valor === objetoVacio) {
            return true
        } else {
            return basic;
        }
    }

    public static verifyEmpty(value: any): boolean {
        const basic: boolean = (value === undefined || value === null);
        if (typeof value === 'string')
            return basic || value === '' || value === "" || value === ``;
        else if (typeof value === 'number')
            return basic || isNaN(value);
        else if (value instanceof Array)
            return basic || value.length <= 0;
        else if (value instanceof Map)
            return basic || value.size == 0;
        else if (value instanceof Date)
            return basic || isNaN(value.getTime());
        else if (typeof value === 'object')
            return basic || Object.keys(value).length === 0;

        return basic;
    }

    public static verifyEmptySimple(value: any): boolean {
        return value === undefined || value === null;
    }

    public static procesarNombre(nombres: string, apellidos: string) {
        let resultado = '';

        resultado += `${nombres.trim().split(" ")[0]} `;
        resultado += `${apellidos.trim().split(" ")[0].charAt(0).toUpperCase()}.`;

        return resultado;
    }

    public static getUserId() {
        return sessionStorage.getItem('user_id');
    }

    public static getRol() {
        return sessionStorage.getItem('rol');
    }

    public static processFilters<T extends GeneralFilter>(filter: T): string {
        if (AppUtil.verifyEmpty(filter))
            return '';

        const filters: Map<string, string> = new Map();
        Object.keys(filter).forEach(key => {
            if (!AppUtil.verifyEmpty(filter[key]))
                filters.set(key, filter[key]);
        });

        if (AppUtil.verifyEmpty(filters))
            return '';

        return Array.from(filters.keys()).map((val, i) => `${(i == 0) ? '?' : '&'}${val}=${filters.get(val)}`).join('');
    }
}