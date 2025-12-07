import { BtnConfig } from "./btn.config";

export interface TableConfig {
    buttons: Array<BtnConfig>;
    columnMappings?: Map<string, Map<string, string>>;
}