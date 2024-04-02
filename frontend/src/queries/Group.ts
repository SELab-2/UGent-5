import type Group from "@/models/Group";
import type { Ref } from "vue";
import type { UseQueryReturnType } from "@tanstack/vue-query";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { getGroupId, getUserGroups } from "@/services/group";

function GROUP_QUERY_KEY(): string[] {
    return ["groups", "me"];
}

function USER_GROUP_QUERY_KEY(projectId: number): (string | number)[] {
    return ["groups", projectId, "me"];
}

/**
 * Get all groups of the current user
 * @returns An array of Group objects
 */
export function useUserGroupsQuery(): UseQueryReturnType<Group[], Error> {
    return useQuery<Group[], Error>({
        queryKey: GROUP_QUERY_KEY(),
        queryFn: getUserGroups,
    });
}

/**
 * Get the group of the current user for a given project
 * @returns The group id, or null if the user is not in a group for this project
 * @param projectId The id of the project
 */
export function useUserGroupQuery(
    projectId: Ref<number | undefined>
): UseQueryReturnType<number | null, Error> {
    const { data: groups } = useUserGroupsQuery();
    return useQuery<number | null, Error>({
        queryKey: computed(() => USER_GROUP_QUERY_KEY(projectId.value!)),
        queryFn: () => getGroupId(groups.value!, projectId.value!),
        enabled: () => groups.value !== undefined,
    });
}
