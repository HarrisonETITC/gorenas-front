import { FormDataConfig, FormItemModel, GeneralFilter } from "@gorenas/domain";
import { Observable } from "rxjs";

export interface UseBaseDataComponent {
    headers: Map<string, string>;
    filterFields: Array<FormItemModel>;
    getInitFilter(): Observable<GeneralFilter>;
    getForms(): Array<FormDataConfig>;
    initFilters(data: any): void;
}