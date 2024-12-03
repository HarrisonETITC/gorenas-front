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
}