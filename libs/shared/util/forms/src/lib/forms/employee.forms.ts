import { Validators } from "@angular/forms";
import { FormDataConfig, FormItemModel } from "@gorenas/domain";

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
                defaultValue: 1420000
            },
            {
                label: 'Sucursal asignada',
                type: FormItemModel.TYPE_AUTO_COMPLETE,
                name: 'salary',
                icon: 'add_location_alt',
                validators: [Validators.required]
            }
        ]
    }
}