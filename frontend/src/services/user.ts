import { authorized_fetch } from "@/services";
import type User from "@/models/User";
import type {UserSubjectList} from "@/models/Subject";


export async function getUser(uid?: string): Promise<User> {
    return authorized_fetch(`/api/users/${uid || "me"}`, { method: "GET" });
}

export async function toggleAdmin() {
    return authorized_fetch<void>("/api/users/me", { method: "POST" });
}

// Fetches all subjects for logged in user
export async function getMySubjects(): Promise<UserSubjectList> {
    return authorized_fetch('/api/users/me/subjects', { method: "GET" });
}


