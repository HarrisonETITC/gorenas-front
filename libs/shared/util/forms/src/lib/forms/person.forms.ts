import { Validators } from "@angular/forms";
import { AppUtil } from "@gorenas/application-core";
import { 
    FormDataConfig, 
    PersonModel, 
    ViewValue,
    TextFormItem,
    SelectFormItem,
    AutoCompleteFormItem,
    DateTimeFormItem,
    BaseFormItemPort
} from "@gorenas/domain";

export class PersonForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear Persona';
        this.CREATE_FORM.buttonTitle = 'Crear';
        
        // Campo nombre(s) - TEXT
        const namesField = new TextFormItem(
            'names',
            BaseFormItemPort.TYPE_TEXT,
            'Nombre(s)',
            'badge',
            null,
            [Validators.required]
        );

        // Campo apellido(s) - TEXT
        const surnamesField = new TextFormItem(
            'surnames',
            BaseFormItemPort.TYPE_TEXT,
            'Apellido(s)',
            'badge',
            null,
            [Validators.required]
        );

        // Campo tipo de identificación - SELECT
        const typeIdentificationField = new SelectFormItem(
            'typeIdentification',
            'Tipo de identificación',
            AppUtil.getViewValuesFromMap(PersonModel.TYPE_IDENTIFICATION_NAMES),
            'assignment_ind',
            null,
            [Validators.required]
        );

        // Campo número de identificación - NUMBER
        const identificationField = new TextFormItem(
            'identification',
            BaseFormItemPort.TYPE_NUMBER,
            'Número de identificación',
            'fingerprint',
            null,
            [Validators.required]
        );

        // Campo número de celular - NUMBER
        const phoneNumberField = new TextFormItem(
            'phoneNumber',
            BaseFormItemPort.TYPE_NUMBER,
            'Número de celular',
            'smartphone',
            null,
            [Validators.required]
        );

        // Campo RH - SELECT (opcional)
        const rhField = new SelectFormItem(
            'rh',
            'RH',
            PersonModel.RH_TYPES.map(rh => new ViewValue(rh, rh)),
            'bloodtype'
        );

        // Campo dirección - TEXT (opcional)
        const addressField = new TextFormItem(
            'address',
            BaseFormItemPort.TYPE_TEXT,
            'Dirección',
            'home'
        );

        // Campo fecha de nacimiento - DATETIME (opcional)
        const bornField = new DateTimeFormItem(
            'born',
            'Fecha de nacimiento',
            'cake'
        );

        // Campo usuario asociado - AUTOCOMPLETE
        // El endpoint se configura en el componente (persons.component.ts)
        const userIdField = new AutoCompleteFormItem(
            'userId',
            'Usuario asociado',
            null, // endpoint se asigna dinámicamente
            'person',
            null,
            [Validators.required]
        );

        // Campo rol - AUTOCOMPLETE
        // El endpoint se configura en el componente (persons.component.ts)
        const roleIdField = new AutoCompleteFormItem(
            'roleId',
            'Rol',
            null, // endpoint se asigna dinámicamente
            'security',
            null,
            [Validators.required]
        );

        this.CREATE_FORM.fields = [
            namesField,
            surnamesField,
            typeIdentificationField,
            identificationField,
            phoneNumberField,
            rhField,
            addressField,
            bornField,
            userIdField,
            roleIdField
        ];
    }
}