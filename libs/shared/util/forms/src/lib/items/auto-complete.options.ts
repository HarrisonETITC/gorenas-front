import { GetAvailablePort } from "@gorenas/application-core";
import { GetIdValueMany } from "@gorenas/application-core";
import { IdValue } from "@gorenas/domain";
import { Observable } from "rxjs/internal/Observable";

export class AutocompleteOptions {
    options?: Observable<Array<IdValue>>;
    endpoint: GetAvailablePort & GetIdValueMany;
}