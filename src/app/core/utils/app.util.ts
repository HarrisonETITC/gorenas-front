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

    public static procesarNombre(nombres: string, apellidos: string) {
        let resultado = '';

        resultado += `${nombres.trim().split(" ")[0]} `;
        resultado += `${apellidos.trim().split(" ")[0].charAt(0).toUpperCase()}.`;

        return resultado;
    }
}