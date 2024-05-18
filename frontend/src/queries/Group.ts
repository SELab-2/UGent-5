import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { UseMutationReturnType, UseQueryReturnType } from "@tanstack/vue-query";
import type Group from "@/models/Group";
import type { GroupForm } from "@/models/Group";
import {
    createGroups,
    createGroup,
    deleteGroup,
    getGroup,
    getProjectGroups,
    getGroupWithProjectId,
    getUserGroups,
    addToGroup,
    joinGroup,
    leaveGroup,
    removeFromGroup,
} from "@/services/group";
import { useCurrentUserQuery } from "@/queries/User";

function GROUP_QUERY_KEY(groupId: number): (string | number)[] {
    return ["group", groupId];
}

function PROJECT_GROUPS_QUERY_KEY(projectId: number): (string | number)[] {
    return ["project", "groups", projectId];
}

function USER_GROUPS_QUERY_KEY(): string[] {
    return ["groups"];
}

function PROJECT_USER_GROUP_QUERY_KEY(projectId: number): (string | number)[] {
    return ["group", "project", projectId];
}

/**
 * Query composable for fetching a group by id
 */
export function useGroupQuery(
    groupId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Group, Error> {
    return useQuery<Group, Error>({
        queryKey: GROUP_QUERY_KEY(toValue(groupId)!),
        queryFn: () => getGroup(toValue(groupId)!),
        enabled: () => !!toValue(groupId),
    });
}

/**
 * Query composable for fetching all groups of a project
 */
export function useProjectGroupsQuery(
    projectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Group[], Error> {
    return useQuery<Group[], Error>({
        queryKey: computed(() => PROJECT_GROUPS_QUERY_KEY(toValue(projectId)!)),
        queryFn: () => getProjectGroups(toValue(projectId)!),
        enabled: !!toValue(projectId),
    });
}

export function useUserGroupsQuery(): UseQueryReturnType<Group[], Error> {
    return useQuery<Group[], Error>({
        queryKey: USER_GROUPS_QUERY_KEY(),
        queryFn: getUserGroups,
    });
}

/**
 * Query composable for fetching the group a user is in for a project
 */
export function useProjectGroupQuery(
    projectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Group | null, Error> {
    const { data: groups } = useUserGroupsQuery();
    return useQuery<Group | null, Error>({
        queryKey: computed(() => PROJECT_USER_GROUP_QUERY_KEY(toValue(projectId)!)),
        queryFn: () => getGroupWithProjectId(groups.value!, toValue(projectId)!),
        enabled: !!toValue(projectId),
    });
}

/**
 * Mutation composable for creating a group for a project
 */
export function useCreateGroupMutation(): UseMutationReturnType<
    Group,
    Error,
    { group: GroupForm },
    void
> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ group }) => createGroup(group.project_id, group),
        onSuccess: (_, { group }) => {
            queryClient.invalidateQueries({ queryKey: PROJECT_GROUPS_QUERY_KEY(group.project_id) });
        },
        onError: () => {
            alert("Could not create group. Please try again.");
        },
    });
}

/**
 * Mutation composable for creating groups
 */
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

/**
 * Mutation composable for adding a user to a group
 */
export function useAddToGroupMutation(): UseMutationReturnType<
    void,
    Error,
    { groupId: number; uid: string },
    { previousGroup: Group }
> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ groupId, uid }) => addToGroup(groupId, uid),
        onMutate: ({ groupId, uid }) => {
            const previousGroup = queryClient.getQueryData<Group>(GROUP_QUERY_KEY(groupId));
            // TODO: this is a placeholder and should be replaced with the
            // actual user data, but query structure does not support this
            // currently
            const newGroup = { ...previousGroup! };
            newGroup.members.push({
                uid,
                given_name: "placeholder",
                surname: "placeholder",
                mail: "placeholder",
                is_teacher: false,
                is_admin: false,
            });
            queryClient.setQueryData<Group>(GROUP_QUERY_KEY(groupId), newGroup);
            return { previousGroup: previousGroup! };
        },
        onSuccess: (_, { groupId }) => {
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEY(groupId) });
        },
        onError: (_, { groupId }, ctx) => {
            queryClient.setQueryData<Group>(GROUP_QUERY_KEY(groupId), ctx!.previousGroup);
            alert("Could not join group. Please try again.");
        },
    });
}

/**
 * Mutation composable for adding the current user to a group
 */
export function useJoinGroupUserMutation(): UseMutationReturnType<
    void,
    Error,
    { groupId: number; projectId: number },
    { previousGroup?: Group; previousProjectGroups?: Group[] }
> {
    const queryClient = useQueryClient();
    const { data: user } = useCurrentUserQuery();
    return useMutation({
        mutationFn: ({ groupId }) => joinGroup(groupId), // Call the joinGroup service function
        onMutate: ({ groupId, projectId }) => {
            const previousGroup = queryClient.getQueryData<Group>(GROUP_QUERY_KEY(groupId));
            const previousProjectGroups = queryClient.getQueryData<Group[]>(
                PROJECT_GROUPS_QUERY_KEY(projectId)
            );
            if (previousGroup) {
                const newGroup = { ...previousGroup, members: [...previousGroup.members] };
                // WARN: This could break if user query is not resolved yet
                newGroup.members.push(user.value!);
                queryClient.setQueryData<Group>(GROUP_QUERY_KEY(groupId), newGroup);
            }
            const newProjectGroups =
                previousProjectGroups?.map((group) => {
                    if (group.id !== groupId) {
                        return group;
                    }
                    // WARN: This could break if user query is not resolved yet
                    return { ...group, members: [...group.members, user.value!] };
                }) || [];
            queryClient.setQueryData<Group[]>(
                PROJECT_GROUPS_QUERY_KEY(projectId),
                newProjectGroups
            );
            return { previousGroup, previousProjectGroups };
        },
        onSuccess: (_, { groupId, projectId }) => {
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEY(groupId) });
            queryClient.invalidateQueries({ queryKey: PROJECT_GROUPS_QUERY_KEY(projectId) });
        },
        onError: (_, { groupId }, ctx) => {
            if (ctx && ctx.previousGroup) {
                queryClient.setQueryData<Group>(GROUP_QUERY_KEY(groupId), ctx.previousGroup);
            }
            if (ctx && ctx.previousProjectGroups) {
                queryClient.setQueryData<Group[]>(
                    PROJECT_GROUPS_QUERY_KEY(ctx.previousProjectGroups[0].project_id),
                    ctx.previousProjectGroups
                );
            }
            alert("Could not join group. Please try again.");
        },
    });
}

/**
 * Mutation composable for removing a user from a group
 */
export function useRemoveUserFromGroupMutation(): UseMutationReturnType<
    void,
    Error,
    { groupId: number; uid: string },
    { previousGroup: Group }
> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ groupId, uid }) => removeFromGroup(groupId, uid),
        onMutate: ({ groupId, uid }) => {
            const previousGroup = queryClient.getQueryData<Group>(GROUP_QUERY_KEY(groupId));
            const newGroup = {
                ...previousGroup!,
                members: previousGroup!.members.filter((member) => member.uid !== uid),
            };
            queryClient.setQueryData<Group>(GROUP_QUERY_KEY(groupId), newGroup);
            return { previousGroup: previousGroup! };
        },
        onSuccess: (_, { groupId }) => {
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEY(groupId) });
        },
        onError: (_, { groupId }, ctx) => {
            queryClient.setQueryData<Group>(GROUP_QUERY_KEY(groupId), ctx!.previousGroup);
            alert("Could not remove from group. Please try again.");
        },
    });
}

const getGroupWithoutUser = (group: Group, uid: string) => {
    return {
        ...group,
        members: group.members.filter((member) => member.uid !== uid),
    };
};

/**
 * Mutation composable for removing the current user from a group
 */
export function useLeaveGroupUserMutation(): UseMutationReturnType<
    void,
    Error,
    { groupId: number; projectId: number },
    { previousGroup?: Group; previousProjectGroups?: Group[] }
> {
    const queryClient = useQueryClient();
    const { data: user } = useCurrentUserQuery();
    return useMutation({
        mutationFn: ({ groupId }) => leaveGroup(groupId),
        onMutate: ({ groupId, projectId }) => {
            const previousGroup = queryClient.getQueryData<Group>(GROUP_QUERY_KEY(groupId));
            const previousProjectGroups = queryClient.getQueryData<Group[]>(
                PROJECT_GROUPS_QUERY_KEY(projectId)
            );
            if (previousGroup) {
                // WARN: This could break if user query is not resolved yet
                const newGroup = getGroupWithoutUser(previousGroup, user.value!.uid);
                queryClient.setQueryData<Group>(GROUP_QUERY_KEY(groupId), newGroup);
            }
            const newProjectGroups =
                previousProjectGroups?.map((group) => {
                    if (group.id !== groupId) {
                        return group;
                    }
                    // WARN: This could break if user query is not resolved yet
                    return getGroupWithoutUser(group, user.value!.uid);
                }) || [];
            queryClient.setQueryData<Group[]>(
                PROJECT_GROUPS_QUERY_KEY(projectId),
                newProjectGroups
            );
            return { previousGroup, previousProjectGroups };
        },
        onSuccess: (_, { groupId, projectId }) => {
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEY(groupId) });
            queryClient.invalidateQueries({ queryKey: PROJECT_GROUPS_QUERY_KEY(projectId) });
            queryClient.invalidateQueries({ queryKey: USER_GROUPS_QUERY_KEY() });
        },
        onError: (_, { groupId }, ctx) => {
            if (ctx && ctx.previousGroup) {
                queryClient.setQueryData<Group>(GROUP_QUERY_KEY(groupId), ctx.previousGroup);
            }
            if (ctx && ctx.previousProjectGroups) {
                queryClient.setQueryData<Group[]>(
                    PROJECT_GROUPS_QUERY_KEY(ctx.previousProjectGroups[0].project_id),
                    ctx.previousProjectGroups
                );
            }
            alert("Could not leave group. Please try again.");
        },
    });
}

/**
 * Mutation composable for deleting a group
 */
export function useDeleteGroupMutation(): UseMutationReturnType<
    void,
    Error,
    { groupId: number; projectId: number },
    void
> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ groupId }) => deleteGroup(groupId),
        onSuccess: (_, { groupId, projectId }) => {
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEY(groupId) });
            queryClient.invalidateQueries({
                queryKey: PROJECT_GROUPS_QUERY_KEY(projectId),
            });
        },
        onError: () => {
            alert("Could not remove from group. Please try again.");
        },
    });
}
