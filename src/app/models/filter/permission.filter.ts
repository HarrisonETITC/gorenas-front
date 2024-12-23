import { GeneralFilter } from "@models/base/general.filter";

export class PermissionFilter extends GeneralFilter {
    roleName: string;
    module: string;
    permission: string;
}