import { FormDataConfig, FormItemModel, GeneralFilter } from "@gorenas/domain";
import { Observable } from "rxjs";
import { BaseDataConfig } from "../../models/base-data.config";

export interface UseBaseDataComponent {
    headers: Map<string, string>;
    filterFields: Array<FormItemModel>;
    pageConfig: BaseDataConfig;
    getInitFilter(): Observable<GeneralFilter>;
    getForms(): Array<FormDataConfig>;
    initFilters(data: any): void;
}