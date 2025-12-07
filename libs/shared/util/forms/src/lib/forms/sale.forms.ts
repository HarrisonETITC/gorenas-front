import { Validators } from "@angular/forms";
import { AppUtil } from "@gorenas/application-core";
import { 
    FormDataConfig, 
    TextFormItem, 
    SelectFormItem,
    AutoCompleteFormItem,
    BaseFormItemPort,
    SaleModel 
} from "@gorenas/domain";

export class SaleForms {
    public static readonly CREATE_FORM = new FormDataConfig();

    static {
        this.CREATE_FORM.title = 'Crear Venta';
        this.CREATE_FORM.buttonTitle = 'Crear';
        
        // Campo empleado - AUTOCOMPLETE
        const employeeField = new AutoCompleteFormItem(
            'employee',
            'Realizada por',
            null, // endpoint se asigna dinámicamente
            'person_alert',
            null,
            [Validators.required]
        );

        // Campo monto - NUMBER
        const amountField = new TextFormItem(
            'amount',
            BaseFormItemPort.TYPE_NUMBER,
            'Monto de la venta',
            'money_bag',
            0,
            [Validators.required, Validators.min(0)]
        );

        // Campo método de pago - SELECT
        const paymentMethodField = new SelectFormItem(
            'paymenthMethod',
            'Método de pago',
            AppUtil.getViewValuesFromMap(SaleModel.PAYMENT_METHODS_NAMES),
            'credit_card',
            null,
            [Validators.required]
        );

        this.CREATE_FORM.fields = [
            employeeField,
            amountField,
            paymentMethodField
        ];
    }
}