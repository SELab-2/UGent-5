import { authorized_fetch } from "@/helpers/datafetchers";

export interface User {
    uid: string;
    given_name: string;
    mail: string;
    is_admin: boolean;
}

export async function getUser(uid?: string): Promise<User> {
    return authorized_fetch(`/api/users/${uid || "me"}`, { method: "GET" });
}
