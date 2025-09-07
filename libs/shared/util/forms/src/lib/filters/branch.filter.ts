import { FormItemModel } from "../items/form-item.model";
import { GeneralFilter } from "@gorenas/domain";

export class BranchFilter extends GeneralFilter {
    public static readonly FIELDS = new Array<FormItemModel>();

    static {
        this.FIELDS.push(
            {
                label: 'Nombre de la sucursal',
                name: 'name',
                icon: 'home_outline',
                type: FormItemModel.TYPE_TEXT,
                defaultValue: '',
                active: true,
                transparent: true
            },
            {
                label: 'Dirección de la sucursal',
                name: 'address',
                icon: 'arrow_forward',
                type: FormItemModel.TYPE_TEXT,
                defaultValue: '',
                transparent: true
            },
            {
                label: 'Ganancias de este mes',
                name: 'earnings',
                icon: 'attach_money',
                type: FormItemModel.TYPE_NUMBER,
                numberOptions: {
                    enableGreatherThan: true,
                    enableLessThan: true,
                    greatherThanLabel: ' (Mayor que)',
                    lessThanLabel: ' (Menor que)'
                },
                defaultValue: NaN,
                transparent: true
            }
        )
    }

    name: string;
    address: string;
    earnings: string;
}