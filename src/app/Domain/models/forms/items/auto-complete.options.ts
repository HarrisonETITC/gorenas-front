import { GetAvailablePort } from "@Application/ports/get-available.port";
import { GetIdValueMany } from "@Application/ports/get-idvalue-many.port";
import { IdValue } from "@Domain/models/general/id-value.interface";
import { Observable } from "rxjs/internal/Observable";

export class AutocompleteOptions {
    options?: Observable<Array<IdValue>>;
    endpoint: GetAvailablePort & GetIdValueMany;
}