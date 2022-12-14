import { Account } from "generated/graphql";

export default interface AccountDTO {
    id?: Account["id"];
    username: Account["username"];
    fullname: Account["fullname"];
    email: Account["email"];
    phone: Account["phone"];
    avatar?: Account["avatar"];
    password?: Account["password"];
    status: Account["status"];
    roleid: Account["roleid"];
}
