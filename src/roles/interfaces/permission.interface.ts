import { Action } from "../enums/action.enum";
import { Resource } from "../enums/resource.enum";

export interface Permission {
    resource: Resource;
    actions: Action[];
}