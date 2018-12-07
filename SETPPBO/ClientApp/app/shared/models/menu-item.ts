export interface IMenuItemModel {
    MenuId: number;
    Link: string;
    Exact: boolean;
    Name: string;
    Icon: string;
    Type: string;
    ParentName: string;
    Disabled: boolean;
    Expanded: boolean;
    Roles: string;
    Order: number;
    RoleList: string[];
    Items: IMenuItemModel[];
}

export class MenuItemModel implements IMenuItemModel {
    Order: number;
    MenuId: number;
    Link: string;
    Exact: boolean;
    Name: string;
    Icon: string;
    Type: string;
    ParentName: string;
    Disabled: boolean;
    Expanded: boolean;
    Roles: string;
    RoleList: string[];
    Items: IMenuItemModel[];
    
}
