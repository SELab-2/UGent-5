import { authorized_fetch } from "@/services";
import type User from "@/models/User";
import type { UserSubjectList } from "@/models/Subject";

export async function getUser(uid: string): Promise<User> {
    return authorized_fetch(`/api/users/${uid}`, { method: "GET" });
}

export async function getCurrentUser(): Promise<User> {
    return authorized_fetch("/api/users/me", { method: "GET" });
}

export async function getUsers(): Promise<User[]> {
    return authorized_fetch("/api/users", { method: "GET" });
}

export async function getUserIds(): Promise<string[]> {
    const users = await authorized_fetch<User[]>("/api/users", { method: "GET" });
    return users.map((user: User) => user.uid);
}

export async function toggleAdmin(uid: string): Promise<User> {
    return authorized_fetch<User>(`/api/users/${uid}/admin`, { method: "POST" });
}

export async function toggleTeacher(uid: string): Promise<User> {
    return authorized_fetch<User>(`/api/users/${uid}/teacher`, { method: "POST" });
}

// Fetches all subjects for logged in user
export async function getMySubjects(): Promise<UserSubjectList> {
    return authorized_fetch("/api/users/me/subjects", { method: "GET" });
}
