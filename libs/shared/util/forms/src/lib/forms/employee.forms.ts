import { Validators } from "@angular/forms";
import { 
    FormDataConfig, 
    TextFormItem, 
    SelectFormItem,
    AutoCompleteFormItem,
    BaseFormItemPort 
} from "@gorenas/domain";
import { StateField } from "./general/state.fields";

export class EmployeeForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear Empleado';
        this.CREATE_FORM.buttonTitle = 'Crear';
        
        // Campo persona asociada - AUTOCOMPLETE
        const personField = new AutoCompleteFormItem(
            'person',
            'Persona asociada',
            null, // endpoint se asigna dinámicamente
            'person_alert',
            null,
            [Validators.required]
        );

        // Campo salario - NUMBER
        const salaryField = new TextFormItem(
            'salary',
            BaseFormItemPort.TYPE_NUMBER,
            'Salario',
            'money_bag',
            1420000,
            [Validators.required, Validators.min(1420000)]
        );

        // Campo sucursal asignada - AUTOCOMPLETE
        const branchField = new AutoCompleteFormItem(
            'branch',
            'Sucursal asignada',
            null, // endpoint se asigna dinámicamente
            'add_location_alt',
            null,
            [Validators.required]
        );

        // Crear copia del StateField con label personalizado
        const stateField = new SelectFormItem(
            StateField.name,
            'Estado del empleado',
            StateField.options,
            StateField.icon,
            null,
            [Validators.required]
        );

        this.CREATE_FORM.fields = [
            personField,
            salaryField,
            branchField,
            stateField
        ];
    }
}