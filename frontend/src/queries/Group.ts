import type Group from "@/models/Group";
import type { GroupForm } from "@/models/Group";
import type { Ref } from "vue";
import type { UseMutationReturnType, UseQueryReturnType } from "@tanstack/vue-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import {
    createGroups,
    deleteGroup,
    getGroup,
    getProjectGroups,
    getGroupWithProjectId,
    getSubmissions,
    getUserGroups,
    addToGroup,
    joinGroup,
    leaveGroup,
    removeFromGroup,
} from "@/services/group";
import type Submission from "@/models/Submission";

function USER_GROUPS_QUERY_KEY(): string[] {
    return ["groups"];
}

function PROJECT_USER_GROUP_QUERY_KEY(projectId: number): (string | number)[] {
    return ["group", "project", projectId];
}

function GROUP_QUERY_KEY(groupId: number): (string | number)[] {
    return ["group", groupId];
}

function submissionsQueryKey(groupId: number): (string | number)[] {
    return ["submissions", groupId];
}

function PROJECT_GROUPS_QUERY_KEY(projectId: number): (string | number)[] {
    return ["projectGroups", projectId];
}

export function useGroupQuery(groupId: Ref<number | undefined>): UseQueryReturnType<Group, Error> {
    return useQuery<Group, Error>({
        queryKey: GROUP_QUERY_KEY(groupId.value!),
        queryFn: () => getGroup(groupId.value!),
        enabled: computed(() => groupId.value !== undefined),
    });
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
        enabled: computed(() => groups.value !== undefined),
    });
}

export function useCreateGroupsMutation(): UseMutationReturnType<
    Group[],
    Error,
    { projectId: number; groups: GroupForm[] },
    void
> {
    const queryClient = useQueryClient();
    return useMutation<Group[], Error, { projectId: number; groups: GroupForm[] }, void>({
        mutationFn: ({ projectId, groups }) => createGroups(projectId, groups),
        onSuccess: () => {
            queryClient.invalidateQueries(/* specify the relevant query key for projects or groups */);
            console.log("Groups created successfully");
        },
        onError: (error) => {
            console.error("Error creating groups:", error);
            alert("Could not create groups. Please try again.");
        },
    });
}

export function useJoinGroupMutation(): UseMutationReturnType<
    void,
    Error,
    { groupId: number; uid: string },
    void
> {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { groupId: number; uid: string }, void>({
        mutationFn: ({ groupId, uid }) => addToGroup(groupId, uid), // Call the joinGroup service function
        onSuccess: () => {
            queryClient.invalidateQueries(/* specify the relevant query key */);
            console.log("Successfully joined group");
        },
        onError: (error) => {
            console.error("Error joining group:", error);
            alert("Could not join group. Please try again.");
        },
    });
}

// Hook for fetching all submissions belonging to a group
export function useSubmissionsQuery(
    groupId: Ref<number | undefined>
): UseQueryReturnType<Submission[], Error> {
    return useQuery<Submission[], Error>({
        queryKey: computed(() => submissionsQueryKey(groupId.value!)),
        queryFn: () => getSubmissions(groupId.value!),
        enabled: computed(() => groupId.value !== undefined),
    });
}

export function useProjectGroupsQuery(
    projectId: Ref<number | undefined>
): UseQueryReturnType<Group[], Error> {
    return useQuery<Group[], Error>({
        queryKey: computed(() => PROJECT_GROUPS_QUERY_KEY(projectId.value!)),
        queryFn: () => getProjectGroups(projectId.value!),
        enabled: computed(() => projectId.value !== undefined),
    });
}

export function useJoinGroupUserMutation(): UseMutationReturnType<
    Group,
    Error,
    { groupId: number },
    void
> {
    const queryClient = useQueryClient();
    return useMutation<Group, Error, { groupId: number }, void>({
        mutationFn: ({ groupId }) => joinGroup(groupId), // Call the joinGroup service function
        onSuccess: () => {
            queryClient.invalidateQueries(/* specify the relevant query key */);
            console.log("Successfully joined group");
        },
        onError: (error) => {
            console.error("Error joining group:", error);
            alert("Could not join group. Please try again.");
        },
    });
}

export function useLeaveGroupUserMutation(): UseMutationReturnType<
    Group,
    Error,
    { groupId: number },
    void
> {
    const queryClient = useQueryClient();
    return useMutation<Group, Error, { groupId: number }, void>({
        mutationFn: ({ groupId }) => leaveGroup(groupId), // Call the joinGroup service function
        onSuccess: () => {
            queryClient.invalidateQueries(/* specify the relevant query key */);
            console.log("Successfully left group");
        },
        onError: (error) => {
            console.error("Error leaving group:", error);
            alert("Could not leave group. Please try again.");
        },
    });
}

export function useRemoveUserFromGroupMutation(): UseMutationReturnType<
    Group,
    Error,
    { groupId: number; uid: string },
    void
> {
    const queryClient = useQueryClient();
    return useMutation<Group, Error, { groupId: number; uid: string }, void>({
        mutationFn: ({ groupId, uid }) => removeFromGroup(groupId, uid), // Call the joinGroup service function
        onSuccess: () => {
            queryClient.invalidateQueries(/* specify the relevant query key */);
            console.log("Successfully removed from group");
        },
        onError: (error) => {
            console.error("Error removing from group:", error);
            alert("Could not remove from group. Please try again.");
        },
    });
}

export function useRemoveGroupMutation(): UseMutationReturnType<
    Group,
    Error,
    { groupId: number },
    void
> {
    const queryClient = useQueryClient();
    return useMutation<Group, Error, { groupId: number }, void>({
        mutationFn: ({ groupId }) => deleteGroup(groupId), // Call the joinGroup service function
        onSuccess: () => {
            queryClient.invalidateQueries(/* specify the relevant query key */);
            console.log("Successfully removed from group");
        },
        onError: (error) => {
            console.error("Error removing from group:", error);
            alert("Could not remove from group. Please try again.");
        },
    });
}
