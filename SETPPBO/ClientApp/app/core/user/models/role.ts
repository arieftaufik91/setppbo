export interface IRole {
    RoleId: string;
    RoleName: string;
    IsChecked: boolean;
}

export class RoleClass implements IRole {
    RoleId: string;
    RoleName: string;
    IsChecked: boolean;
}