import { FormItemModel } from "@Domain/models/forms/form-item.model";
import { Observable } from "rxjs";

export interface AutocompleteFieldPort {
    updateAutoCompleteData(queryHandler: Observable<string>, field: FormItemModel): void;
}