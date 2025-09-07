import { PersonModelView } from "@gorenas/domain";
import { Observable } from "rxjs";

export interface PersonPort {
    getPersonInfo(): Observable<PersonModelView>;
}