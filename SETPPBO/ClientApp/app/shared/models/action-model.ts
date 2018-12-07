import { ISysParam } from "./sys-param";

export interface IRoleAction {
  Role: string;
  Action: string;
  Actions: ISysParam[];
}

export class RoleAction implements IRoleAction {
  Actions: ISysParam[];
  Role: string;
  Action: string;
}
