export interface User {
    UserId: string;
    PegawaiId: string;
    Nama: string;
    Nip: string;
    IsLocked: boolean;
    Gravatar: string;
    Roles: string;
    UserRoles: string[];
}