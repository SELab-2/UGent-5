import type Group from "@/models/Group";
import type { GroupForm } from "@/models/Group";
import { authorized_fetch } from "@/services/index";

/**
 * Fetches the group with the given ID.
 */
export async function getGroup(groupId: number): Promise<Group> {
    return authorized_fetch(`/api/groups/${groupId}`, { method: "GET" });
}

export async function getUserGroups(): Promise<Group[]> {
    const result = await authorized_fetch<{ groups: Group[] }>(`/api/users/me/groups`, {
        method: "GET",
    });
    return result.groups;
}

/**
 * Fetches all groups of a project.
 */
export async function getProjectGroups(projectId: number): Promise<Group[]> {
    const result = await authorized_fetch<{ groups: Group[] }>(
        `/api/projects/${projectId}/groups`,
        { method: "GET" }
    );
    return result.groups;
}

/**
 * Creates a new group.
 */
export async function createGroup(projectId: number, group: GroupForm): Promise<Group> {
    return authorized_fetch<Group>(`/api/groups/`, {
        method: "POST",
        body: JSON.stringify({ ...group, projectId }),
    });
}

export async function createGroups(projectId: number, groups: GroupForm[]): Promise<Group[]> {
    const createPromises = groups.map((group) => createGroup(projectId, group));
    return Promise.all(createPromises);
}

/**
 * Adds the current user to a group.
 */
export async function joinGroup(groupId: number): Promise<void> {
    return authorized_fetch(`/api/groups/${groupId}`, { method: "POST" });
}

/**
 * Adds a user to a group.
 */
export async function addToGroup(groupId: number, uid: string): Promise<void> {
    await authorized_fetch(`/api/groups/${groupId}/${uid}`, {
        method: "POST",
    });
}

/**
 * Removes the current user from a group.
 */
export async function leaveGroup(groupId: number): Promise<void> {
    return authorized_fetch(`/api/groups/${groupId}/leave`, { method: "POST" });
}

/**
 * Removes a user from a group.
 */
export async function removeFromGroup(groupId: number, uid: string): Promise<void> {
    return authorized_fetch(`/api/groups/${groupId}/${uid}`, { method: "DELETE" });
}

/**
 * Deletes a group.
 */
export async function deleteGroup(groupId: number): Promise<void> {
    return authorized_fetch(`/api/groups/${groupId}`, { method: "DELETE" });
}
