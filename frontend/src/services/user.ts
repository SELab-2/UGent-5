import { authorized_fetch } from "@/services";
import type User from "@/models/User";

/**
 * Fetches the user with the given ID.
 */
export async function getUser(uid: string): Promise<User> {
    return authorized_fetch(`/api/users/${uid}`, { method: "GET" });
}

/**
 * Fetches the user with the given UUID.
 */
export async function getCurrentUser(): Promise<User> {
    return authorized_fetch("/api/users/me", { method: "GET" });
}

/**
 * Fetches all users.
 */
export async function getUsers(): Promise<User[]> {
    return authorized_fetch("/api/users", { method: "GET" });
}

/**
 * Toggles the admin status of the user with the given ID.
 */
export async function toggleAdmin(uid: string): Promise<User> {
    return authorized_fetch<User>(`/api/users/${uid}/admin`, { method: "POST" });
}

/**
 * Toggles the teacher status of the user with the given ID.
 */
export async function toggleTeacher(uid: string): Promise<User> {
    return authorized_fetch<User>(`/api/users/${uid}/teacher`, { method: "POST" });
}
