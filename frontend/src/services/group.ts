import type Group from "@/models/Group";
import type { GroupForm } from "@/models/Group";
import { authorized_fetch } from "@/services/index";
import type Submission from "@/models/Submission";

export async function getUserGroups(): Promise<Group[]> {
    return authorized_fetch<{ groups: Group[] }>(`/api/users/me/groups`, { method: "GET" }).then(
        (data) => data.groups
    );
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

export async function createSubmission(groupId: number, formData: FormData): Promise<Submission> {
    return authorized_fetch(
        `/api/submissions/?group_id=${groupId}`,
        {
            method: "POST",
            body: formData,
        },
        { omitContentType: true }
    );
}

export async function joinGroup(groupId: number, uid: string): Promise<void> {
    await authorized_fetch(`/api/groups/${groupId}/${uid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
}
