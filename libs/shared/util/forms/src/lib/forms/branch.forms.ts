import { Validators } from "@angular/forms";
import { AppUtil } from "@gorenas/application-core";
import { 
    FormDataConfig, 
    TextFormItem, 
    SelectFormItem,
    BaseFormItemPort,
    StateModel 
} from "@gorenas/domain";

export class BranchForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear sucursal';
        this.CREATE_FORM.buttonTitle = 'Crear';
        
        // Campo nombre - TEXT
        const nameField = new TextFormItem(
            'name',
            BaseFormItemPort.TYPE_TEXT,
            'Nombre de la sucursal',
            'drag_handle',
            '',
            [Validators.required]
        );

        // Campo dirección - TEXT
        const addressField = new TextFormItem(
            'address',
            BaseFormItemPort.TYPE_TEXT,
            'Dirección de la sucursal',
            'conversion_path',
            '',
            [Validators.required]
        );

        // Campo estado - SELECT
        const stateField = new SelectFormItem(
            'state',
            'Estado de la sucursal',
            AppUtil.getViewValuesFromMap(StateModel.STATES_NAMES),
            'shield',
            null,
            [Validators.required]
        );

        this.CREATE_FORM.fields = [
            nameField,
            addressField,
            stateField
        ];
    }
}