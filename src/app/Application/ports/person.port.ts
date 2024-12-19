import { PersonModelView } from "@Domain/models/model-view/person.mv";
import { Observable } from "rxjs";

export interface PersonPort {
    getPersonInfo(): Observable<PersonModelView>;
}