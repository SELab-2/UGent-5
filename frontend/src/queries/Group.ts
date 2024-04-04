import type Group from "@/models/Group";
import type { Ref } from "vue";
import type { UseQueryReturnType } from "@tanstack/vue-query";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { getGroupWithProjectId, getUserGroups } from "@/services/group";

function USER_GROUPS_QUERY_KEY(): string[] {
    return ["groups"];
}

function PROJECT_USER_GROUP_QUERY_KEY(projectId: number): (string | number)[] {
    return ["group", "project", projectId];
}

/**
 * Get all groups of the current user
 * @returns An array of Group objects
 */
export function useUserGroupsQuery(): UseQueryReturnType<Group[], Error> {
    return useQuery<Group[], Error>({
        queryKey: USER_GROUPS_QUERY_KEY(),
        queryFn: getUserGroups,
    });
}

/**
 * Get the group of the current user for a given project
 * @returns The group object, or null if the user is not in a group for this project
 * @param projectId The id of the project
 */
export function useUserGroupQuery(
    projectId: Ref<number | undefined>
): UseQueryReturnType<Group | null, Error> {
    const { data: groups } = useUserGroupsQuery();
    return useQuery<Group | null, Error>({
        queryKey: computed(() => PROJECT_USER_GROUP_QUERY_KEY(projectId.value!)),
        queryFn: () => getGroupWithProjectId(groups.value!, projectId.value!),
        enabled: () => groups.value !== undefined,
    });
}
