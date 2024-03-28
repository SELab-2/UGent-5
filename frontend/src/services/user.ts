import { authorized_fetch } from "@/services";
import type User from "@/models/User";

export async function getUser(uid?: string): Promise<User> {
    return authorized_fetch(`/api/users/${uid || "me"}`, { method: "GET" });
}

export async function toggleAdmin() {
    authorized_fetch<void>("/api/users/me", { method: "POST" });
}
