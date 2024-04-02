import type Group from "@/models/Group";
import { authorized_fetch } from "@/services/index";

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
