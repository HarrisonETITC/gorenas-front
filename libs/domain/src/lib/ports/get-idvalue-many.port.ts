import { IdValue } from "../models/general/id-value.model";
import { Observable } from "rxjs";

export interface GetIdValueMany {
    getIdValueMany(values: Array<any>): Observable<Array<IdValue>>;
}
