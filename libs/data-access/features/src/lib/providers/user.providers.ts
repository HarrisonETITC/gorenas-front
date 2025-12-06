import { Provider } from "@angular/core";
import { USER_SERVICE } from "@gorenas/application-core";
import { UserServiceAdapter } from "../adapters/user-adapter.service";

export const UserProviders: Array<Provider> = [
    {
        provide: USER_SERVICE,
        useClass: UserServiceAdapter
    }
]