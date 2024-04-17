import type Group from "@/models/Group";
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


export function createGroup(projectId: string, group: Group): Promise<Group> {
    return authorized_fetch(`/api/groups/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...group, projectId}),
    }).then(response => response.id);  // Assuming the backend sends back the created group as JSON
}

// Adjust createGroups to return an array of created groups
export function createGroups(projectId: string, groups: Group[]): Promise<Group[]> {
    const createPromises = groups.map(group => createGroup(projectId, group));
    return Promise.all(createPromises);
}


export async function createSubmission(groupId: number, formData: FormData): Promise<Submission> {
    return authorized_fetch(
        `/api/submissions/?group_id=${groupId}`,
        {
            method: "POST",
            body: formData,
        },
        true // If this flag is intended for handling multipart/form-data or a different response, consider adding a comment to clarify its purpose
    );
}

export async function joinGroup(groupId: number, uid: string): Promise<void> {
    try {
        const response = await authorized_fetch(`/api/groups/${groupId}/${uid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error joining group:", error);
        throw error; // Rethrow the error to handle it elsewhere (e.g., in a React component)
    }
}
