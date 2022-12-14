import { USER_ENUM } from "utils/enums";

export interface LoginModel {
    username: string;
    password: string;
}

export interface LoginResponseModel {
    username: string;
    roleid: number;
    status: USER_ENUM;
    avatar?: string;
    email: string;
    fullname: string;
    id: number;
    phone: string;
    role: {
        name: string;
    };
}
