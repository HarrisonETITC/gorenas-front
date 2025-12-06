import { Validators } from "@angular/forms";
import { AppUtil } from "@gorenas/application-core";
import { FormDataConfig, FormItemModel, PersonModel, ViewValue } from "@gorenas/domain";

export class PersonForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear Persona';
        this.CREATE_FORM.buttonTitle = 'Crear';
        this.CREATE_FORM.fields = [
            {
                label: 'Nombre(s)',
                type: FormItemModel.TYPE_TEXT,
                name: 'names',
                icon: 'badge',
                validators: [Validators.required],
            },
            {
                label: 'Apellido(s)',
                type: FormItemModel.TYPE_TEXT,
                name: 'surnames',
                icon: 'badge',
                validators: [Validators.required],
            },
            {
                label: 'Tipo de identificación',
                type: FormItemModel.TYPE_SELECT,
                name: 'typeIdentification',
                icon: 'assignment_ind',
                selectOptions: {
                    options: AppUtil.getViewValuesFromMap(PersonModel.TYPE_IDENTIFICATION_NAMES)
                },
                validators: [Validators.required]
            },
            {
                label: 'Número de identificación',
                type: FormItemModel.TYPE_NUMBER,
                name: 'identification',
                icon: 'fingerprint',
                validators: [Validators.required],
            },
            {
                label: 'Número de celular',
                type: FormItemModel.TYPE_NUMBER,
                name: 'phoneNumber',
                icon: 'smartphone',
                validators: [Validators.required],
            },
            {
                label: 'RH',
                type: FormItemModel.TYPE_SELECT,
                name: 'rh',
                icon: 'bloodtype',
                selectOptions: {
                    options: PersonModel.RH_TYPES.map(rh => new ViewValue(rh, rh))
                }
            },
            {
                label: 'Dirección',
                type: FormItemModel.TYPE_TEXT,
                name: 'address',
                icon: 'home',
            },
            {
                label: 'Fecha de nacimiento',
                type: FormItemModel.TYPE_DATETIME,
                name: 'born',
                icon: 'cake'
            },
            {
                label: 'Usuario asociado',
                type: FormItemModel.TYPE_AUTO_COMPLETE,
                name: 'userId',
                icon: 'person',
                validators: [Validators.required]
            },
            {
                label: 'Rol',
                type: FormItemModel.TYPE_AUTO_COMPLETE,
                name: 'roleId',
                icon: 'security',
                validators: [Validators.required]
            }
        ]
    }
}