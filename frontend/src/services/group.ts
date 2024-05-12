import type Group from "@/models/Group";
import type { GroupForm } from "@/models/Group";
import type Submission from "@/models/Submission";
import { authorized_fetch } from "@/services/index";

/**
 * Fetches the group with the given ID.
 */
export async function getGroup(groupId: number): Promise<Group> {
    return authorized_fetch(`/api/groups/${groupId}`, { method: "GET" });
}

// TODO: figure out why this is needed
export async function getUserGroups(): Promise<Group[]> {
    const result = await authorized_fetch<{ groups: Group[] }>(`/api/users/me/groups`, {
        method: "GET",
    });
    return result.groups;
}

// TODO: figure out why this is needed
export function getGroupWithProjectId(groups: Group[], projectId: number): Group | null {
    for (const group of groups) {
        if (group.project_id === projectId) {
            return group;
        }
    }
    return null;
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

// TODO: can this be moved?
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

// TODO: Add to submission service
export async function getSubmissions(groupId: number): Promise<Submission[]> {
    return authorized_fetch(`/api/groups/${groupId}/submissions`, { method: "GET" });
}
