import type Group from "@/models/Group";
import type { GroupForm } from "@/models/Group";
import type Submission from "@/models/Submission";
import { authorized_fetch } from "@/services/index";

export async function getGroup(groupId: number): Promise<Group> {
    return authorized_fetch(`/api/groups/${groupId}`, { method: "GET" });
}

export async function getUserGroups(): Promise<Group[]> {
    return authorized_fetch<{ groups: Group[] }>(`/api/users/me/groups`, { method: "GET" }).then(
        (data) => data.groups
    );
}

export async function getGroupsByProjectId(projectId: number): Promise<Group[]> {
    return authorized_fetch<{ groups: Group[] }>(`/api/projects/${projectId}/groups`, {
        method: "GET",
    }).then((data) => data.groups);
}

export function getGroupWithProjectId(groups: Group[], projectId: number): Group | null {
    for (const group of groups) {
        if (group.project_id === projectId) {
            return group;
        }
    }
    return null;
}

export async function createGroup(projectId: number, group: GroupForm): Promise<Group> {
    return authorized_fetch<Group>(`/api/groups/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...group, projectId }),
    });
}

export async function createGroups(projectId: number, groups: GroupForm[]): Promise<Group[]> {
    const createPromises = groups.map((group) => createGroup(projectId, group));
    return Promise.all(createPromises);
}

export async function joinGroup(groupId: number, uid: string): Promise<void> {
    try {
        await authorized_fetch(`/api/groups/${groupId}/${uid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error joining group:", error);
        throw error;
    }
}

export async function getSubmissions(groupId: number): Promise<Submission[]> {
    return authorized_fetch(`/api/groups/${groupId}/submissions`, { method: "GET" });
}

export async function joinGroupUser(groupId: number): Promise<Group> {
    return authorized_fetch(`/api/groups/${groupId}`, { method: "POST" });
}

export async function leaveGroupUser(groupId: number): Promise<Group> {
    return authorized_fetch(`/api/groups/${groupId}/leave`, { method: "POST" });
}

export async function removeUserFromGroup(groupId: number, uid: string): Promise<Group> {
    return authorized_fetch(`/api/groups/${groupId}/${uid}`, { method: "DELETE" });
}

export async function deleteGroup(groupId: number): Promise<Group> {
    return authorized_fetch(`/api/groups/${groupId}`, { method: "DELETE" });
}
