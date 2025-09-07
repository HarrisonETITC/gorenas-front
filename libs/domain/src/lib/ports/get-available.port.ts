import { IdValue } from "../models/general/id-value.model";
import { Observable } from "rxjs";

export interface GetAvailablePort {
    getAvailable(query?: string): Observable<Array<IdValue>>;
}
