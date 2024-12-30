import { FormItemModel } from "@Domain/models/forms/form-item.model";
import { GeneralFilter } from "@models/base/general.filter";

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
                type: FormItemModel.TYPE_TEXT,
                defaultValue: '',
                transparent: true
            }
        )
    }

    name: string;
    address: string;
    earnings: string;
}