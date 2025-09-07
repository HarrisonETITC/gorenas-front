import { IdValue } from "@gorenas/domain";
import { Observable } from "rxjs";

export interface GetIdValueMany {
    getIdValueMany(values: Array<any>): Observable<Array<IdValue>>;
}