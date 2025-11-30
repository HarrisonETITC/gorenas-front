import { Provider } from "@angular/core";
import { EMPLOYEE_SERVICE } from "@gorenas/application-core";
import { EmployeeServiceAdapter } from "../adapters/employee-adapter.service";

export const EmployeeProviders: Array<Provider> = [
    {
        provide: EMPLOYEE_SERVICE,
        useClass: EmployeeServiceAdapter
    }
]