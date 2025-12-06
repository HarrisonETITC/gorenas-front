import { Validators } from "@angular/forms";
import { AppUtil } from "@gorenas/application-core";
import { FormDataConfig, FormItemModel, SaleModel, SaleModelView, ViewValue } from "@gorenas/domain";

export class SaleForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear Venta';
        this.CREATE_FORM.buttonTitle = 'Crear';
        this.CREATE_FORM.fields = [
            {
                label: 'Realizada por',
                type: FormItemModel.TYPE_AUTO_COMPLETE,
                name: 'employee',
                icon: 'person_alert',
                validators: [Validators.required]
            },
            {
                label: 'Monto de la venta',
                type: FormItemModel.TYPE_NUMBER,
                name: 'amount',
                icon: 'money_bag',
                validators: [Validators.required, Validators.min(0)],
                defaultValue: 0
            },
            {
                label: 'Método de pago',
                type: FormItemModel.TYPE_SELECT,
                name: 'paymenthMethod',
                icon: 'credit_card',
                validators: [Validators.required],
                selectOptions: {
                    options: AppUtil.getViewValuesFromMap(SaleModel.PAYMENT_METHODS_NAMES)
                }
            }
        ]
    }
}