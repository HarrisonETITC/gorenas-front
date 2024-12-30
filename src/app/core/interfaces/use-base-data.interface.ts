import { FormDataConfig } from "@Domain/models/forms/form-data-config.model";
import { FormItemModel } from "@Domain/models/forms/form-item.model";
import { GeneralFilter } from "@models/base/general.filter";
import { Observable } from "rxjs";

export interface UseBaseDataComponent {
    headers: Map<string, string>;
    filterFields: Array<FormItemModel>;
    getInitFilter(): Observable<GeneralFilter>;
    getForms(): Array<FormDataConfig>;
    initFilters(data: any): void;
}