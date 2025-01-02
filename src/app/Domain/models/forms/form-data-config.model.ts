import { FormItemModel } from "./items/form-item.model";
import { GetByIdPort } from "@Application/ports/get-by-id.port";

export class FormDataConfig<T = any> {
    public static readonly MODE_FORM = 'form';
    public static readonly MODE_CONTROLS = 'controls';

    title: string;
    buttonTitle: string;
    fields: Array<FormItemModel>;
    transparentMode?: boolean;
    tabTitle?: string;
    dataInitializer?: GetByIdPort<T>;
}