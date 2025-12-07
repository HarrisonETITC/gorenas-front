import { FormField } from "@gorenas/domain";
import { Observable } from "rxjs";

export interface AutocompleteFieldPort {
    updateAutoCompleteData(queryHandler: Observable<string>, field: FormField): void;
}