import { IdValue } from "@gorenas/domain";
import { Observable } from "rxjs";

export interface GetAvailablePort {
    getAvailable(query?: string): Observable<Array<IdValue>>;
}