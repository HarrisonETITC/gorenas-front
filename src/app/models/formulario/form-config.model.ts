export class FormConfig {
    titulo: string;
    nombreBoton: string;
    botonCancelar: boolean;

    constructor(titulo: string, nombreBoton: string, botonCancelar?: boolean) {
        this.titulo = titulo;
        this.nombreBoton = nombreBoton;
        this.botonCancelar = botonCancelar ?? true;
    }
}