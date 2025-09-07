import { Validators } from "@angular/forms";
import { FormDataConfig, ViewValue } from "@gorenas/domain";
import { FormItemModel } from "@gorenas/domain";
import { StateModel } from "@gorenas/domain";

export class BranchForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear sucursal';
        this.CREATE_FORM.buttonTitle = 'Crear';
        this.CREATE_FORM.fields = [
            {
                label: 'Nombre de la sucursal',
                type: FormItemModel.TYPE_TEXT,
                name: 'name',
                icon: 'drag_handle',
                validators: [Validators.required],
                defaultValue: ''
            },
            {
                label: 'Dirección de la sucursal',
                type: FormItemModel.TYPE_TEXT,
                name: 'address',
                icon: 'conversion_path',
                validators: [Validators.required],
                defaultValue: ''
            },
            {
                label: 'Estado de la sucursal',
                type: FormItemModel.TYPE_SELECT,
                name: 'state',
                icon: 'shield',
                validators: [Validators.required],
                selectOptions: {
                    options: Array.from(StateModel.STATES_NAMES.keys()).map(key => new ViewValue(key, StateModel.STATES_NAMES.get(key)))
                }
            }
        ]
    }
}