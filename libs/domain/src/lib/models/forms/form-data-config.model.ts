import { FormItemModel } from "./form-item.model";
import { GetByIdPort } from "../../ports/get-by-id.port";

/**
 * Configuración para formularios dinámicos
 */
export class FormDataConfig<T = any> {
    public static readonly MODE_FORM = 'form';
    public static readonly MODE_CONTROLS = 'controls';

    title!: string;
    buttonTitle!: string;
    /** Título para modo edición (opcional, si no se define usa 'Editar [title]') */
    editTitle?: string;
    /** Texto del botón en modo edición (opcional, si no se define usa 'Actualizar') */
    editButtonTitle?: string;
    fields!: Array<FormItemModel>;
    transparentMode?: boolean;
    tabTitle?: string;
    dataInitializer?: GetByIdPort<T>;

    /**
     * Obtiene el título según el modo (creación o edición)
     */
    getTitle(isEdit: boolean): string {
        if (isEdit) {
            return this.editTitle || this.title.replace(/Crear/i, 'Editar');
        }
        return this.title;
    }

    /**
     * Obtiene el texto del botón según el modo (creación o edición)
     */
    getButtonTitle(isEdit: boolean): string {
        if (isEdit) {
            return this.editButtonTitle || 'Actualizar';
        }
        return this.buttonTitle;
    }
}
