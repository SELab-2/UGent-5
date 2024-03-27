import type UserDTO from "@/module/user/UserModel";
import { type RequestOptions } from "@/helpers/datafetchers";

interface UserRepository {
    getUser: (uid?: string) => Promise<UserDTO>;
}

class FetchUserRepository implements UserRepository {
    constructor(private fetch: <T>(url: string, requestOptions: RequestOptions) => Promise<T>) {}
    async getUser(uid?: string): Promise<UserDTO> {
        const url = uid ? `/api/users/${uid}` : "/api/users/me";
        return this.fetch(url, { method: "GET" });
    }
}

export { type UserRepository, FetchUserRepository };
