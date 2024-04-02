import type Group from "@/models/Group";
import { authorized_fetch } from "@/services/index";

export async function getUserGroups(): Promise<Group[]> {
    return authorized_fetch<{ groups: Group[] }>(`/api/users/me/groups`, { method: "GET" }).then(
        (data) => data.groups
    );
}

export function getGroupId(groups: Group[], projectId: number): number | null {
    for (const group of groups) {
        if (group.project_id === projectId) {
            return group.id;
        }
    }
    return null;
}
