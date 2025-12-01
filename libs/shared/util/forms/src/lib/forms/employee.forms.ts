import { Validators } from "@angular/forms";
import { FormDataConfig, FormItemModel, StateModel, ViewValue } from "@gorenas/domain";

export class EmployeeForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear Empleado';
        this.CREATE_FORM.buttonTitle = 'Crear';
        this.CREATE_FORM.fields = [
            {
                label: 'Persona asociada',
                type: FormItemModel.TYPE_AUTO_COMPLETE,
                name: 'person',
                icon: 'person_alert',
                validators: [Validators.required]
            },
            {
                label: 'Salario',
                type: FormItemModel.TYPE_NUMBER,
                name: 'salary',
                icon: 'money_bag',
                validators: [Validators.required, Validators.min(1420000)],
                numberOptions: {
                    enableGreatherThan: false,
                    enableLessThan: false
                },
                defaultValue: 1420000
            },
            {
                label: 'Sucursal asignada',
                type: FormItemModel.TYPE_AUTO_COMPLETE,
                name: 'branch',
                icon: 'add_location_alt',
                validators: [Validators.required]
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