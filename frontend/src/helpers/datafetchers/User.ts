import { myFetch } from "@/helpers/datafetchers";

export interface User {
    uid: string;
    given_name: string;
    mail: string;
    is_admin: boolean;
}

export async function getUser(): Promise<User> {
    return await myFetch("/api/users/me", {method: "GET"});
}
