import { authorized_fetch } from "@/helpers/datafetchers";
import type UserDTO from "@/module/user/UserModel";

export async function getUser(uid?: string): Promise<UserDTO> {
    return authorized_fetch(`/api/users/${uid || "me"}`, { method: "GET" });
}
