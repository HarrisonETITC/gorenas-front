import { BaseFormItemPort, TextFormItem, NumberFormItem } from "@gorenas/domain";
import { GeneralFilter } from "@gorenas/domain";

export class BranchFilter extends GeneralFilter {
    public static readonly FIELDS = new Array<BaseFormItemPort>();

    static {
        this.FIELDS.push(
            new TextFormItem(
                'name',
                BaseFormItemPort.TYPE_TEXT,
                'Nombre de la sucursal',
                'home_outline',
                '',
                [],
                true,
                true
            ),
            new TextFormItem(
                'address',
                BaseFormItemPort.TYPE_TEXT,
                'Dirección de la sucursal',
                'arrow_forward',
                '',
                [],
                false,
                true
            ),
            new NumberFormItem(
                'earnings',
                'Ganancias de este mes',
                'attach_money',
                null,
                [],
                false,
                true,
                false,
                {
                    enableGreatherThan: true,
                    greatherThanLabel: ' (Mayor que)',
                    enableLessThan: true,
                    lessThanLabel: ' (Menor que)'
                }
            )
        )
    }

    name: string;
    address: string;
    earnings: string;
}