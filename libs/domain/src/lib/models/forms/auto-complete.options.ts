import { GetAvailablePort } from "../../ports/get-available.port";
import { GetIdValueMany } from "../../ports/get-idvalue-many.port";
import { IdValue } from "../general/id-value.interface";
import { Observable } from "rxjs/internal/Observable";

export class AutocompleteOptions {
    options?: Observable<Array<IdValue>>;
    endpoint: GetAvailablePort & GetIdValueMany;
}
